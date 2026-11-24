"""The Epistemic Diary — Manim theme (D2: ivory paper, brown ink; owner decision 2026-11-24).

    from epistemic_theme import *        # sets the background and defaults
    class MyScene(EpistemicScene): ...

Fonts: Source Serif 4 for titles and labels, Patrick Hand for handwritten annotations only;
mathematics stays LaTeX (MathTex) in ink colour. Both fonts are OFL and are registered from
manim/fonts/ so renders do not depend on system fonts.
"""
import os
from contextlib import ExitStack
from manim import *

HERE = os.path.dirname(os.path.abspath(__file__))
PAPER, INK, MUTED, GRID = "#F7F5F0", "#332E28", "#6A6256", "#D9D1C3"
ACCENT, SLATE, OLIVE, OCHRE = "#8C4A32", "#3F6584", "#5F6F2E", "#9A6A12"
SERIF, HAND = "Source Serif 4", "Patrick Hand"

config.background_color = PAPER
Text.set_default(font=SERIF, color=INK)
MathTex.set_default(color=INK)
Tex.set_default(color=INK)
Line.set_default(color=INK)

def hand(text, **kw):
    """Handwritten annotation (annotations only, never for data or mathematics)."""
    return Text(text, font=HAND, color=kw.pop("color", ACCENT), **kw)

class EpistemicScene(Scene):
    """Registers the bundled fonts for the duration of the render."""
    def render(self, *a, **kw):
        with ExitStack() as stack:
            for f in ("SourceSerif4.ttf", "PatrickHand-Regular.ttf"):
                p = os.path.join(HERE, "fonts", f)
                if os.path.exists(p):
                    stack.enter_context(register_font(p))
            return super().render(*a, **kw)
