"""The Epistemic Diary plotting helpers (D2).

    import epistemic_plot as ep
    ep.use()                       # load the house style
    fig, ax = plt.subplots(figsize=ep.FIG_WIDE)
    ...
    ep.note(ax, "cân bằng Nash", xy=(.5, .5), xytext=(.7, .8))   # handwritten annotation
    ep.save_web(fig, "assets/plots/name.svg")   # theme-aware SVG for the site
    ep.save_print(fig, "out/name.png")          # fixed light colours, 2x, for slides/print

Colours are written in the light palette and mapped to CSS variables in save_web, so the
same figure follows the site's light and dark themes. Text stays text (svg.fonttype none):
selectable, translatable and readable by screen readers.

Rule for web figures: no matplotlib mathtext ($...$) in labels. Write symbols in Unicode
(p, q, BR₁, σ*, ½) and put real formulas in the caption or the essay (MathJax). Mathtext
glyphs would need TeX fonts the browser does not have, and they lose Vietnamese letters.
"""
import os, re
import matplotlib as mpl
import matplotlib.pyplot as plt

HERE = os.path.dirname(os.path.abspath(__file__))
INK, MUTED, GRID = "#332e28", "#6a6256", "#d9d1c3"
SERIES = ["#8c4a32", "#3f6584", "#5f6f2e", "#9a6a12"]
FIG_WIDE, FIG_SQUARE = (6.4, 3.6), (4.8, 4.2)
HAND = "Patrick Hand"           # annotations only; never for data or mathematics
CSS = {INK: "var(--plot-ink)", MUTED: "var(--plot-muted)", GRID: "var(--plot-grid)",
       SERIES[0]: "var(--plot-1)", SERIES[1]: "var(--plot-2)", SERIES[2]: "var(--plot-3)", SERIES[3]: "var(--plot-4)"}

def use():
    plt.style.use(os.path.join(HERE, "epistemic.mplstyle"))
    font = os.path.join(HERE, "PatrickHand-Regular.ttf")
    if os.path.exists(font):
        mpl.font_manager.fontManager.addfont(font)

def note(ax, text, xy, xytext, color=SERIES[0], **kw):
    """Handwritten annotation with a light arrow (D2: handwriting for annotations only)."""
    return ax.annotate(text, xy=xy, xytext=xytext, fontfamily=HAND, fontsize=14, color=color,
                       arrowprops=dict(arrowstyle="-|>", color=color, lw=0.9, shrinkA=2, shrinkB=4,
                                       connectionstyle="arc3,rad=-0.2"), **kw)

def save_web(fig, path, title=None):
    """Theme-aware SVG: palette hex → CSS variables, no fixed size, optional <title>."""
    fig.savefig(path, format="svg", bbox_inches="tight", metadata={"Date": None, "Creator": None})
    s = open(path, encoding="utf-8").read()
    for hexv, var in CSS.items():
        s = re.sub(re.escape(hexv), var, s, flags=re.I)
    s = re.sub(r'<svg ([^>]*?)width="[^"]+" height="[^"]+"', r'<svg \1class="plot-svg"', s, count=1)
    # Fonts: the site's serif for all text, the handwriting face for annotations.
    s = re.sub(r"font-family: *'Patrick Hand'", "font-family:'Patrick Hand', cursive", s)
    s = re.sub(r"font-family: +(?!'Patrick Hand')[^;\"]+", "font-family: var(--ed-serif)", s)
    if "$" in "".join(t.get_text() for t in fig.findobj(mpl.text.Text)):
        raise ValueError("save_web: mathtext ($...$) is not allowed in web figures; use Unicode")
    if title:
        s = re.sub(r'(<svg[^>]*>)', lambda m: m.group(1) + '<title>' + title + '</title>', s, count=1)
    s = re.sub(r'<\?xml[^>]*>\s*|<!DOCTYPE[^>]*>\s*', '', s)
    open(path, "w", encoding="utf-8").write(s)

def save_print(fig, path, dpi=200):
    fig.savefig(path, dpi=dpi, bbox_inches="tight", facecolor="#f7f5f0")
