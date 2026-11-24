"""Best-response correspondences of Matching Pennies (D2 example figure).
Player 1 (matcher) plays H when q > 1/2, T when q < 1/2, anything at q = 1/2;
player 2 (mismatcher) plays H when p < 1/2, T when p > 1/2, anything at p = 1/2.
They cross only at (p, q) = (1/2, 1/2): the unique (mixed) Nash equilibrium."""
import sys, matplotlib.pyplot as plt
sys.path.insert(0, __file__.rsplit("/", 1)[0]); import epistemic_plot as ep
ep.use()
fig, ax = plt.subplots(figsize=ep.FIG_SQUARE)
c1, c2 = ep.SERIES[0], ep.SERIES[1]
ax.plot([0, 0, 1, 1], [0, .5, .5, 1], color=c1, label="BR₁(q): người chơi 1")
ax.plot([0, .5, .5, 1], [1, 1, 0, 0], color=c2, linestyle=(0, (5, 3)), label="BR₂(p): người chơi 2")
ax.plot([.5], [.5], "o", color=ep.INK, markersize=6, zorder=5)
ep.note(ax, "cân bằng Nash (½, ½)", xy=(.5, .5), xytext=(.45, .76), color=ep.INK)
ax.set_xlim(-.05, 1.05); ax.set_ylim(-.05, 1.05)
ax.set_xlabel("p: xác suất người chơi 1 chọn H"); ax.set_ylabel("q: xác suất người chơi 2 chọn H")
ax.set_xticks([0, .5, 1], ["0", "½", "1"]); ax.set_yticks([0, .5, 1], ["0", "½", "1"])
ax.legend(loc="lower left", bbox_to_anchor=(0, 1.02), ncol=1)
ep.save_web(fig, sys.argv[1], title="Đường phản ứng tốt nhất của hai người chơi trong Matching Pennies, cắt nhau tại (1/2, 1/2)")
if len(sys.argv) > 2: ep.save_print(fig, sys.argv[2])
