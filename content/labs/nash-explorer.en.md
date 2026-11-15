---
title: "2×2 Nash equilibrium explorer"
description: "Edit the payoff matrix, load classic games and watch pure and mixed equilibria and expected-payoff curves change."
date: 2025-08-01T09:00:00+07:00
weight: 1
math: true
tech: "React · Recharts"
requires: "Needs a desktop or landscape tablet screen; phones show a text fallback."
related: /kinh-te/game_theory_nash
---

This experiment accompanies the essay on game theory and Nash equilibrium. Each slider is one cell of the two players' payoff matrix, and everything is recomputed as you move it.

## What it computes

- **All pure-strategy Nash equilibria**, highlighted in the normal-form table
- **The unique mixed-strategy equilibrium** $(p^*, q^*)$ when it exists in $(0,1)^2$
- **Expected payoff curves** $U_1(p)$ and $U_2(p)$ as a function of Player 1's mixing probability, at a fixed $q$ you control

## Suggested experiments

| Preset | What to observe |
|--------|----------------|
| Prisoner's Dilemma | Unique pure NE at $(D,D)$; no mixed NE in $(0,1)^2$ |
| Battle of the Sexes | Two pure NE; mixed NE exists but is Pareto-dominated by both pure NE |
| Matching Pennies | No pure NE; unique mixed NE at $p^*=q^*=0.5$ |
| Stag Hunt | Two pure NE; the Pareto-optimal $(T,L)$ is risk-dominated by $(B,R)$ |

## The explorer

{{< react name="NashEquilibriumSim" >}}
