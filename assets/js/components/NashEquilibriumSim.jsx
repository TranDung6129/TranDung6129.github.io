/**
 * NashEquilibriumSim.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Interactive 2×2 bimatrix game explorer.
 *
 * Features:
 *   • Editable payoff matrix (8 sliders — 2 players × 2×2 entries)
 *   • Live computation of:
 *       – Pure-strategy Nash Equilibria
 *       – Mixed-strategy NE (p*, q*) when no dominant pure NE exists
 *   • Best-response correspondence plotted on the (p, q) unit square
 *   • Payoff vs. mixing probability curves for both players
 *
 * Libraries: recharts only. No Tailwind / MUI.
 * Theming:   Hugo FixIt CSS variables (dark/light auto).
 */

import React, { useState, useCallback, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ReferenceDot, Legend,
} from "recharts";

// ── Theme tokens (Hugo FixIt CSS variables) ──────────────────────────────────
const T = {
  bg:        "var(--code-bg-color)",
  surface:   "var(--code-bg-color)",
  border:    "var(--border-color)",
  text:      "var(--text-color)",
  primary:   "var(--primary-color)",
  p1:        "#4FC3F7",
  p2:        "#EF9A9A",
  ne:        "#A5D6A7",
  muted:     "#888",
};

// ── Utility: find pure-strategy NE ──────────────────────────────────────────
function findPureNE(a, b) {
  /*
   * a[i][j] = payoff to row player when (row i, col j)
   * b[i][j] = payoff to col player when (row i, col j)
   * Returns array of {row, col} objects.
   */
  const NE = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      // Row player: is row i a BR to col j?
      const p1BR = a[i][j] >= a[1 - i][j];
      // Col player: is col j a BR to row i?
      const p2BR = b[i][j] >= b[i][1 - j];
      if (p1BR && p2BR) NE.push({ row: i, col: j });
    }
  }
  return NE;
}

// ── Utility: find mixed-strategy NE ─────────────────────────────────────────
function findMixedNE(a, b) {
  /*
   * For a 2×2 game:
   * Row player mixes with prob p on row 0 (= "Top").
   * Col player mixes with prob q on col 0 (= "Left").
   *
   * p* satisfies col player's indifference:
   *   p·b[0][0] + (1-p)·b[1][0]  =  p·b[0][1] + (1-p)·b[1][1]
   *   → p·(b[0][0]-b[1][0]-b[0][1]+b[1][1]) = b[1][1]-b[1][0]
   *
   * q* satisfies row player's indifference:
   *   q·a[0][0] + (1-q)·a[0][1]  =  q·a[1][0] + (1-q)·a[1][1]
   *   → q·(a[0][0]-a[0][1]-a[1][0]+a[1][1]) = a[1][1]-a[0][1]
   */
  const pDen = b[0][0] - b[1][0] - b[0][1] + b[1][1];
  const qDen = a[0][0] - a[0][1] - a[1][0] + a[1][1];

  if (Math.abs(pDen) < 1e-9 || Math.abs(qDen) < 1e-9) return null;

  const pStar = (b[1][1] - b[1][0]) / pDen;
  const qStar = (a[1][1] - a[0][1]) / qDen;

  if (pStar < 0 || pStar > 1 || qStar < 0 || qStar > 1) return null;
  return { p: pStar, q: qStar };
}

// ── Utility: expected payoffs ────────────────────────────────────────────────
function expectedPayoffs(a, b, p, q) {
  const u1 = p * (q * a[0][0] + (1 - q) * a[0][1]) +
             (1 - p) * (q * a[1][0] + (1 - q) * a[1][1]);
  const u2 = p * (q * b[0][0] + (1 - q) * b[0][1]) +
             (1 - p) * (q * b[1][0] + (1 - q) * b[1][1]);
  return { u1, u2 };
}

// ── Sub-component: PayoffSlider ───────────────────────────────────────────────
function PayoffSlider({ label, value, onChange, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 72 }}>
      <span style={{ fontSize: 13, color: color, fontWeight: 600, letterSpacing: "0.03em" }}>{label}</span>
      <input
        type="range" min={-10} max={10} step={0.5}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: 68, accentColor: color }}
      />
      <span style={{ fontSize: 14, color: T.text, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

// ── Sub-component: MatrixCell ─────────────────────────────────────────────────
function MatrixCell({ r1, r2, isNE, children }) {
  return (
    <div style={{
      padding: "8px 12px",
      border: `2px solid ${isNE ? T.ne : T.border}`,
      borderRadius: 6,
      background: isNE ? `${T.ne}1A` : T.bg,
      textAlign: "center",
      minWidth: 120,
      fontSize: 16,
      fontFamily: "monospace",
      transition: "all 0.2s",
      boxShadow: isNE ? `0 0 8px ${T.ne}66` : "none",
    }}>
      <span style={{ color: T.p1, fontWeight: 700 }}>{r1 >= 0 ? `+${r1}` : r1}</span>
      <span style={{ color: T.muted }}>, </span>
      <span style={{ color: T.p2, fontWeight: 700 }}>{r2 >= 0 ? `+${r2}` : r2}</span>
      {isNE && <div style={{ fontSize: 12, color: T.ne, marginTop: 2 }}>★ NE</div>}
    </div>
  );
}

// ── Payoff curve data generator ───────────────────────────────────────────────
function buildPayoffCurves(a, b, qFixed) {
  /* Vary p ∈ [0,1], hold q fixed → show u1(p) and u2(p) */
  return Array.from({ length: 41 }, (_, k) => {
    const p = k / 40;
    const { u1, u2 } = expectedPayoffs(a, b, p, qFixed);
    return { p: +p.toFixed(3), u1: +u1.toFixed(3), u2: +u2.toFixed(3) };
  });
}

// ── Main component ────────────────────────────────────────────────────────────
export default function NashEquilibriumSim() {
  /* Default: Prisoner's Dilemma
   *   a[0][0]=−1  a[0][1]=−3    (row player: C vs C, C vs D)
   *   a[1][0]= 0  a[1][1]=−2    (row player: D vs C, D vs D)
   *   b is symmetric
   */
  const [a, setA] = useState([[-1, -3], [0, -2]]);
  const [b, setB] = useState([[-1, 0], [-3, -2]]);
  const [qSlider, setQSlider] = useState(0.5);  // for payoff curve

  const updateA = useCallback((i, j, v) => {
    setA(prev => {
      const next = prev.map(r => [...r]);
      next[i][j] = v;
      return next;
    });
  }, []);

  const updateB = useCallback((i, j, v) => {
    setB(prev => {
      const next = prev.map(r => [...r]);
      next[i][j] = v;
      return next;
    });
  }, []);

  const pureNE = useMemo(() => findPureNE(a, b), [a, b]);
  const mixedNE = useMemo(() => findMixedNE(a, b), [a, b]);
  const payoffData = useMemo(() => buildPayoffCurves(a, b, qSlider), [a, b, qSlider]);

  const isNE = (r, c) => pureNE.some(ne => ne.row === r && ne.col === c);

  // Strategy labels
  const rowLabels = ["Top (T)", "Bottom (B)"];
  const colLabels = ["Left (L)", "Right (R)"];

  // Payoff at current mixing
  const pCurrent = mixedNE?.p ?? 0.5;
  const { u1: uAtNE, u2: u2AtNE } = mixedNE
    ? expectedPayoffs(a, b, mixedNE.p, mixedNE.q)
    : { u1: null, u2: null };

  return (
    <div style={{
      fontFamily: "system-ui, -apple-system, sans-serif",
      color: T.text,
      background: "transparent",
      padding: "10px 0",
      width: "100%",
      margin: "32px 0",
      boxSizing: "border-box",
    }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 22, color: T.primary, fontWeight: 700 }}>
          Nash Equilibrium Explorer
        </h3>
        <p style={{ margin: "6px 0 0", fontSize: 15, color: T.muted }}>
          Edit the 2×2 bimatrix game — pure & mixed NE update live.
        </p>
      </div>

      {/* ── Payoff matrix editors ── */}
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap", marginBottom: 24 }}>
        {/* Player 1 matrix */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.p1, marginBottom: 8 }}>
            Player 1 Payoffs  (row)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[0, 1].map(i => [0, 1].map(j => (
              <PayoffSlider
                key={`a${i}${j}`}
                label={`(${rowLabels[i].split(" ")[0]}, ${colLabels[j].split(" ")[0]})`}
                value={a[i][j]}
                onChange={v => updateA(i, j, v)}
                color={T.p1}
              />
            )))}
          </div>
        </div>

        {/* Player 2 matrix */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.p2, marginBottom: 8 }}>
            Player 2 Payoffs  (col)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[0, 1].map(i => [0, 1].map(j => (
              <PayoffSlider
                key={`b${i}${j}`}
                label={`(${rowLabels[i].split(" ")[0]}, ${colLabels[j].split(" ")[0]})`}
                value={b[i][j]}
                onChange={v => updateB(i, j, v)}
                color={T.p2}
              />
            )))}
          </div>
        </div>

        {/* Preset buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.muted, marginBottom: 2 }}>Presets</div>
          {[
            { label: "Prisoner's Dilemma", a: [[-1,-3],[0,-2]], b: [[-1,0],[-3,-2]] },
            { label: "Battle of Sexes",    a: [[2,0],[0,1]],    b: [[1,0],[0,2]] },
            { label: "Matching Pennies",   a: [[1,-1],[-1,1]],  b: [[-1,1],[1,-1]] },
            { label: "Stag Hunt",          a: [[4,0],[3,3]],    b: [[4,3],[0,3]] },
          ].map(({ label, a: pa, b: pb }) => (
            <button
              key={label}
              onClick={() => { setA(pa); setB(pb); }}
              style={{
                padding: "5px 10px", fontSize: 14, cursor: "pointer",
                background: T.surface, color: T.primary,
                border: `1px solid ${T.primary}`, borderRadius: 5,
                transition: "background 0.15s",
              }}
            >{label}</button>
          ))}
        </div>
      </div>

      {/* ── Normal form table ── */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.muted, marginBottom: 10 }}>
          Normal Form
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {/* Row header column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginRight: 4 }}>
            <div style={{ height: 28 }} />
            {rowLabels.map(rl => (
              <div key={rl} style={{ fontSize: 14, color: T.p1, fontWeight: 600,
                minWidth: 80, textAlign: "right", paddingRight: 8, height: 52,
                display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                {rl}
              </div>
            ))}
          </div>
          {/* Col headers + cells */}
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              {colLabels.map(cl => (
                <div key={cl} style={{ fontSize: 14, color: T.p2, fontWeight: 600,
                  width: 100, textAlign: "center" }}>{cl}</div>
              ))}
            </div>
            {[0, 1].map(i => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                {[0, 1].map(j => (
                  <MatrixCell key={j} r1={a[i][j]} r2={b[i][j]} isNE={isNE(i, j)} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── NE summary ── */}
      <div style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 8, padding: "14px 16px", marginBottom: 22,
      }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: T.ne, marginBottom: 8 }}>
          Equilibrium Analysis
        </div>
        {/* Pure NE */}
        <div style={{ fontSize: 15, marginBottom: 6 }}>
          <span style={{ color: T.muted }}>Pure-strategy NE: </span>
          {pureNE.length === 0
            ? <span style={{ color: T.muted }}>None</span>
            : pureNE.map(ne => (
                <span key={`${ne.row}${ne.col}`} style={{
                  background: `${T.ne}2A`, color: T.ne,
                  borderRadius: 4, padding: "2px 7px", marginRight: 6,
                  fontFamily: "monospace", fontWeight: 700,
                }}>
                  ({rowLabels[ne.row].split(" ")[0]}, {colLabels[ne.col].split(" ")[0]})
                </span>
              ))
          }
        </div>
        {/* Mixed NE */}
        <div style={{ fontSize: 15 }}>
          <span style={{ color: T.muted }}>Mixed-strategy NE: </span>
          {mixedNE
            ? <>
                <span style={{ color: T.primary, fontFamily: "monospace", fontWeight: 700 }}>
                  p* = {mixedNE.p.toFixed(3)},  q* = {mixedNE.q.toFixed(3)}
                </span>
                <span style={{ color: T.muted, marginLeft: 10, fontSize: 14 }}>
                  → U₁ = {uAtNE?.toFixed(3)},  U₂ = {u2AtNE?.toFixed(3)}
                </span>
              </>
            : <span style={{ color: T.muted }}>Does not exist in (0,1)² or game is degenerate</span>
          }
        </div>
      </div>

      {/* ── Expected payoff curves ── */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.muted, marginBottom: 6 }}>
          Expected Payoffs vs. Player 1 mixing probability  <em>p</em>
          &nbsp;(at fixed q = {qSlider.toFixed(2)})
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <span style={{ fontSize: 14, color: T.muted }}>q =</span>
          <input
            type="range" min={0} max={1} step={0.01}
            value={qSlider}
            onChange={e => setQSlider(Number(e.target.value))}
            style={{ width: 160, accentColor: T.primary }}
          />
          <span style={{ fontSize: 15, fontFamily: "monospace", color: T.text }}>{qSlider.toFixed(2)}</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={payoffData} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} opacity={0.5} />
            <XAxis dataKey="p" type="number" domain={[0, 1]}
              label={{ value: "p (P1 prob of Top)", position: "insideBottomRight", offset: -4, fill: T.muted, fontSize: 13 }}
              tick={{ fill: T.muted, fontSize: 13 }} />
            <YAxis tick={{ fill: T.muted, fontSize: 13 }} />
            <Tooltip
              contentStyle={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 14 }}
              labelStyle={{ color: T.muted }}
              formatter={(v, name) => [v.toFixed(3), name === "u1" ? "U₁(p)" : "U₂(p)"]}
            />
            <Legend
              formatter={v => v === "u1" ? "U₁ (Player 1)" : "U₂ (Player 2)"}
              wrapperStyle={{ fontSize: 14 }}
            />
            {mixedNE && (
              <ReferenceLine x={mixedNE.p} stroke={T.ne} strokeDasharray="4 4"
                label={{ value: "p*", position: "top", fill: T.ne, fontSize: 13 }} />
            )}
            <Line type="monotone" dataKey="u1" stroke={T.p1} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="u2" stroke={T.p2} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Footer note ── */}
      <p style={{ fontSize: 13, color: T.muted, marginTop: 14, borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
        ★ = Pure-strategy Nash Equilibrium (neither player can profitably deviate unilaterally).
        Mixed NE shown only when it lies strictly in (0,1)².
        Payoff entries are the raw values you set — positive = reward, negative = cost.
      </p>
    </div>
  );
}
// force rebuild
