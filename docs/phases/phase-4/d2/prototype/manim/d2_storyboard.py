"""D2 storyboard: three still frames for the Matching Pennies film (review only).
Render:  manim -s -qm d2_storyboard.py Frame1Title Frame2Matrix Frame3BestResponse"""
from epistemic_theme import *

class Frame1Title(EpistemicScene):
    def construct(self):
        kicker = Text("LÝ THUYẾT TRÒ CHƠI", font_size=22, color=ACCENT, weight=BOLD).shift(UP * 1.4)
        title = Text("Matching Pennies", font_size=64).next_to(kicker, DOWN, buff=0.35)
        sub = Text("Khi không có lựa chọn an toàn, hãy để may rủi quyết định", font_size=26, color=MUTED, slant=ITALIC).next_to(title, DOWN, buff=0.4)
        rule = Line(LEFT * 2, RIGHT * 2, color=GRID, stroke_width=2).next_to(sub, DOWN, buff=0.45)
        self.add(kicker, title, sub, rule)

class Frame2Matrix(EpistemicScene):
    def construct(self):
        head = Text("Ma trận lợi ích", font_size=36).to_edge(UP, buff=0.6)
        t = MathTable([["(+1,-1)", "(-1,+1)"], ["(-1,+1)", "(+1,-1)"]],
                      row_labels=[Text("H", font_size=30), Text("T", font_size=30)],
                      col_labels=[Text("H", font_size=30), Text("T", font_size=30)],
                      include_outer_lines=False, line_config={"stroke_color": MUTED, "stroke_width": 1.5},
                      element_to_mobject_config={"color": INK}).scale(0.85).shift(DOWN * 0.2)
        cell = t.get_cell((2, 2), color=ACCENT)
        note = hand("khớp nhau:\nngười 1 thắng", font_size=30, line_spacing=0.8).next_to(t, LEFT, buff=0.6).shift(UP * 1.3)
        arrow = CurvedArrow(note.get_right() + RIGHT * 0.1, cell.get_corner(UL) + RIGHT * 0.25 + UP * 0.02, color=ACCENT, stroke_width=2, angle=-PI / 3)
        self.add(head, t, cell, note, arrow)

class Frame3BestResponse(EpistemicScene):
    def construct(self):
        ax = Axes(x_range=[0, 1, 0.5], y_range=[0, 1, 0.5], x_length=4.6, y_length=4.6,
                  axis_config={"color": INK, "stroke_width": 1.5, "include_ticks": True}, tips=False).shift(LEFT * 1.6 + DOWN * 0.2)
        grid = VGroup(*[DashedLine(ax.c2p(0, v), ax.c2p(1, v), color=GRID, stroke_width=1) for v in (0.5, 1)],
                      *[DashedLine(ax.c2p(v, 0), ax.c2p(v, 1), color=GRID, stroke_width=1) for v in (0.5, 1)])
        br1 = VMobject(color=ACCENT, stroke_width=5).set_points_as_corners([ax.c2p(0, 0), ax.c2p(0, .5), ax.c2p(1, .5), ax.c2p(1, 1)])
        br2 = DashedVMobject(VMobject(color=SLATE, stroke_width=5).set_points_as_corners([ax.c2p(0, 1), ax.c2p(.5, 1), ax.c2p(.5, 0), ax.c2p(1, 0)]), num_dashes=30)
        dot = Dot(ax.c2p(.5, .5), color=INK, radius=0.09)
        ticks = VGroup(*[MathTex(t, font_size=28).next_to(ax.c2p(v, 0), DOWN, buff=0.2) for t, v in ((r"0", 0), (r"\tfrac12", .5), (r"1", 1))],
                       *[MathTex(t, font_size=28).next_to(ax.c2p(0, v), LEFT, buff=0.2) for t, v in ((r"\tfrac12", .5), (r"1", 1))])
        xl = MathTex("p", font_size=36).next_to(ax.c2p(1, 0), RIGHT, buff=0.35)
        yl = MathTex("q", font_size=36).next_to(ax.c2p(0, 1), UP, buff=0.3)
        l1 = VGroup(Line(ORIGIN, RIGHT * 0.6, color=ACCENT, stroke_width=5), MathTex(r"\mathrm{BR}_1(q)", font_size=32)).arrange(RIGHT, buff=0.2)
        l2 = VGroup(DashedLine(ORIGIN, RIGHT * 0.6, color=SLATE, stroke_width=5), MathTex(r"\mathrm{BR}_2(p)", font_size=32)).arrange(RIGHT, buff=0.2)
        legend = VGroup(l1, l2).arrange(DOWN, aligned_edge=LEFT, buff=0.3).to_edge(RIGHT, buff=1.6).shift(UP * 1.2)
        note = hand("cân bằng Nash (½, ½)", font_size=30, color=INK).next_to(legend, DOWN, buff=0.9).align_to(legend, LEFT)
        arrow = CurvedArrow(note.get_left() + LEFT * 0.1, dot.get_right() + RIGHT * 0.12, color=INK, stroke_width=2, angle=PI / 5)
        self.add(grid, ax, br1, br2, dot, ticks, xl, yl, legend, note, arrow)
