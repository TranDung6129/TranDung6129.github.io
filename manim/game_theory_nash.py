"""
Game Theory & Nash Equilibrium — Manim Visualization
=====================================================
Animates the core concepts:
  1. Strategic-form (normal-form) game as a payoff matrix
  2. Best-response correspondences in a 2×2 game (Prisoner's Dilemma)
  3. Convergence to Nash Equilibrium via best-response dynamics
  4. The mixed-strategy Nash Equilibrium via intersection of BR curves

Run:
    manim -pqh game_theory_nash.py GameTheoryNash
"""

from manim import *
import numpy as np

# ── Color palette ────────────────────────────────────────────────────────────
P1_COLOR   = "#4FC3F7"   # player 1 — light blue
P2_COLOR   = "#EF9A9A"   # player 2 — light red
NE_COLOR   = "#A5D6A7"   # Nash Equilibrium highlight — green
GRAY_LIGHT = "#BDBDBD"
TITLE_COLOR = WHITE


class GameTheoryNash(Scene):
    """
    Multi-scene animation covering:
      Scene 1 — What is a strategic-form game?  (Prisoner's Dilemma matrix)
      Scene 2 — Dominant strategy & iterated elimination
      Scene 3 — Best-response dynamics (arrows on the matrix)
      Scene 4 — Mixed strategy: BR curves intersect at NE
    """

    # ── Prisoner's Dilemma payoffs (row player, col player) ─────────────────
    #          C          D
    #  C    (-1,-1)   (-3, 0)
    #  D    ( 0,-3)   (-2,-2)
    PAYOFFS = {
        ("C", "C"): (-1, -1),
        ("C", "D"): (-3,  0),
        ("D", "C"): ( 0, -3),
        ("D", "D"): (-2, -2),
    }

    # ──────────────────────────────────────────────────────────────────────────
    def construct(self):
        self.scene_intro()
        self.scene_matrix()
        self.scene_best_response_dynamics()
        self.scene_mixed_strategy()

    # ── Scene 1 : Introduction ────────────────────────────────────────────────
    def scene_intro(self):
        title = Text("Game Theory & Nash Equilibrium", font_size=44, color=TITLE_COLOR)
        subtitle = Text(
            "A formal tour from strategic-form games to equilibrium",
            font_size=24, color=GRAY_LIGHT
        ).next_to(title, DOWN, buff=0.4)
        self.play(Write(title), run_time=1.5)
        self.play(FadeIn(subtitle, shift=UP * 0.2))
        self.wait(1.5)

        definition = VGroup(
            Text("A Nash Equilibrium is a strategy profile", font_size=22, color=WHITE),
            MathTex(
                r"s^* = (s_1^*, s_2^*, \ldots, s_n^*)",
                font_size=28, color=NE_COLOR
            ),
            Text("such that no player can profitably deviate unilaterally.", font_size=22, color=WHITE),
        ).arrange(DOWN, buff=0.25).next_to(subtitle, DOWN, buff=0.6)

        self.play(FadeIn(definition, shift=UP * 0.15))
        self.wait(2)
        self.play(FadeOut(VGroup(title, subtitle, definition)))

    # ── Scene 2 : Payoff Matrix (Prisoner's Dilemma) ─────────────────────────
    def scene_matrix(self):
        heading = Text("The Prisoner's Dilemma", font_size=36, color=TITLE_COLOR).to_edge(UP)
        self.play(Write(heading))

        # ── Build the 2×2 table ──────────────────────────────────────────────
        cell_w, cell_h = 2.4, 1.3
        rows = ["C (Cooperate)", "D (Defect)"]
        cols = ["C (Cooperate)", "D (Defect)"]

        # Header labels
        p1_label = Text("Player 1  ↓", font_size=20, color=P1_COLOR).move_to([-3.6,  0.9, 0])
        p2_label = Text("Player 2  →", font_size=20, color=P2_COLOR).move_to([-0.3,  2.2, 0])
        self.play(FadeIn(p1_label), FadeIn(p2_label))

        cells = VGroup()
        payoff_texts = VGroup()

        origins = {
            ("C", "C"): np.array([-2.4 + 0*cell_w,  0.3 - 0*cell_h, 0]),
            ("C", "D"): np.array([-2.4 + 1*cell_w,  0.3 - 0*cell_h, 0]),
            ("D", "C"): np.array([-2.4 + 0*cell_w,  0.3 - 1*cell_h, 0]),
            ("D", "D"): np.array([-2.4 + 1*cell_w,  0.3 - 1*cell_h, 0]),
        }

        for key, origin in origins.items():
            rect = Rectangle(width=cell_w, height=cell_h, color=GRAY_LIGHT, stroke_width=1.5)
            rect.move_to(origin)
            cells.add(rect)

            p1_pay, p2_pay = self.PAYOFFS[key]
            pay_str = MathTex(
                rf"({p1_pay},\;{p2_pay})",
                font_size=26
            ).move_to(origin)
            pay_str[0][1].set_color(P1_COLOR)   # player 1 payoff digit
            pay_str[0][3].set_color(P2_COLOR)   # player 2 payoff digit
            payoff_texts.add(pay_str)

        # Row & column headers
        row_labels = VGroup(
            Text("C", font_size=22, color=P1_COLOR).move_to([-3.2,  0.3, 0]),
            Text("D", font_size=22, color=P1_COLOR).move_to([-3.2,  0.3 - cell_h, 0]),
        )
        col_labels = VGroup(
            Text("C", font_size=22, color=P2_COLOR).move_to([-2.4 + cell_w/2,  1.1, 0]),
            Text("D", font_size=22, color=P2_COLOR).move_to([-2.4 + 1*cell_w + cell_w/2,  1.1, 0]),
        )

        self.play(Create(cells), FadeIn(row_labels), FadeIn(col_labels))
        self.play(Write(payoff_texts))
        self.wait(1)

        # Explanation text
        explainer = VGroup(
            Text("Each cell shows payoffs as (Player 1, Player 2).", font_size=20, color=WHITE),
            Text("Negative values = years in prison (lower is better).", font_size=20, color=GRAY_LIGHT),
        ).arrange(DOWN, buff=0.18).to_edge(DOWN).shift(UP * 0.3)
        self.play(FadeIn(explainer))
        self.wait(2)

        # Highlight dominant strategy for each player
        dom_title = Text("Dominant Strategy: Defect (D)", font_size=22, color=NE_COLOR)
        dom_title.next_to(heading, DOWN, buff=0.15)
        self.play(Write(dom_title))

        # Arrow P1: regardless of P2's choice, D is better for P1
        arrow_D_C = Arrow(
            start=origins[("C","C")] + LEFT*0.5,
            end=origins[("D","C")] + LEFT*0.5,
            color=P1_COLOR, buff=0.1, stroke_width=3
        )
        arrow_D_D = Arrow(
            start=origins[("C","D")] + RIGHT*0.5,
            end=origins[("D","D")] + RIGHT*0.5,
            color=P1_COLOR, buff=0.1, stroke_width=3
        )
        label_p1 = Text("P1 prefers D", font_size=18, color=P1_COLOR).next_to(arrow_D_C, LEFT, buff=0.15)
        self.play(GrowArrow(arrow_D_C), GrowArrow(arrow_D_D), FadeIn(label_p1))
        self.wait(1.2)

        # Nash Equilibrium highlight box
        ne_cell = origins[("D", "D")]
        ne_box = SurroundingRectangle(
            payoff_texts[3], color=NE_COLOR, buff=0.18, stroke_width=3
        )
        ne_label = Text("Nash Equilibrium: (D, D)", font_size=22, color=NE_COLOR)
        ne_label.next_to(ne_box, RIGHT, buff=0.25)
        self.play(Create(ne_box), Write(ne_label))
        self.wait(2)

        self.play(FadeOut(VGroup(
            heading, dom_title, cells, payoff_texts, row_labels, col_labels,
            p1_label, p2_label, explainer, arrow_D_C, arrow_D_D,
            label_p1, ne_box, ne_label
        )))

    # ── Scene 3 : Best-Response Dynamics ─────────────────────────────────────
    def scene_best_response_dynamics(self):
        """
        Illustrate iterated best-response convergence on a 3×3 coordination game.
        Payoff matrix A for row player:
             L    M    R
          T  4    0    1
          M  0    3    0
          B  1    0    4
        This has a pure NE at (T,L), (B,R) and a mixed-strategy NE.
        We show best-response arrows converging to (T,L).
        """
        heading = Text("Best-Response Dynamics", font_size=36, color=TITLE_COLOR).to_edge(UP)
        self.play(Write(heading))

        # 3×3 payoffs (row player only — symmetric for visual clarity)
        A = np.array([
            [4, 0, 1],
            [0, 3, 0],
            [1, 0, 4],
        ])

        cell_w, cell_h = 1.8, 1.2
        origin_base = np.array([-2.5, 1.0, 0])
        rows_lbl = ["T", "M", "B"]
        cols_lbl = ["L", "M", "R"]

        cells = VGroup()
        pay_texts = VGroup()
        cell_centers = {}

        for i in range(3):
            for j in range(3):
                pos = origin_base + np.array([j * cell_w, -i * cell_h, 0])
                cell_centers[(i, j)] = pos
                rect = Rectangle(width=cell_w, height=cell_h, color=GRAY_LIGHT, stroke_width=1.2)
                rect.move_to(pos)
                cells.add(rect)
                pay = MathTex(str(A[i, j]), font_size=26).move_to(pos)
                pay_texts.add(pay)

        row_labels = VGroup(*[
            Text(rows_lbl[i], font_size=22, color=P1_COLOR)
            .move_to(origin_base + np.array([-1.1, -i * cell_h, 0]))
            for i in range(3)
        ])
        col_labels = VGroup(*[
            Text(cols_lbl[j], font_size=22, color=P2_COLOR)
            .move_to(origin_base + np.array([j * cell_w, 0.75, 0]))
            for j in range(3)
        ])

        p1_lbl = Text("Player 1  ↓", font_size=18, color=P1_COLOR).move_to([-3.3, 1.6, 0])
        p2_lbl = Text("Player 2  →", font_size=18, color=P2_COLOR).move_to([-0.5, 1.95, 0])

        self.play(Create(cells), FadeIn(row_labels), FadeIn(col_labels),
                  FadeIn(p1_lbl), FadeIn(p2_lbl))
        self.play(Write(pay_texts))

        description = Text(
            "Arrow: current player's best response to opponent's action",
            font_size=19, color=GRAY_LIGHT
        ).to_edge(DOWN).shift(UP * 0.4)
        self.play(FadeIn(description))
        self.wait(0.8)

        # ── BRD trajectory: (B,R) → (T,?) → (T,L) ──────────────────────────
        # Start: P2 plays R (col 2). P1's BR: B (row 2, payoff 4)
        start_dot = Dot(cell_centers[(2, 2)], color=YELLOW, radius=0.18)
        start_lbl = Text("Start: (B, R)", font_size=18, color=YELLOW).next_to(start_dot, RIGHT, buff=0.2)
        self.play(FadeIn(start_dot), Write(start_lbl))
        self.wait(0.5)

        # P2 plays R → P1's BR is B (A[2,2]=4 vs A[0,2]=1 vs A[1,2]=0)
        br1_arrow = Arrow(
            start=cell_centers[(2, 2)],
            end=cell_centers[(2, 2)] + np.array([0, 0, 0]),  # already at B
            color=P1_COLOR, buff=0, stroke_width=3
        )
        br1_text = Text("P1 BR → B", font_size=17, color=P1_COLOR).to_edge(RIGHT).shift(UP * 1.5)
        self.play(FadeIn(br1_text))
        self.wait(0.5)

        # P1 plays B → P2's BR: L (A[2,0]=1 vs A[2,1]=0 vs A[2,2]=4... wait)
        # Actually for col player (symmetric) BR to P1=B: col R (A[2,2]=4>1>0)
        # Let's start at (T,M) instead for a cleaner path to (T,L)
        # P2 plays M → P1 BR: M (A[1,1]=3)
        self.play(FadeOut(start_dot), FadeOut(start_lbl), FadeOut(br1_text))

        # Step-by-step BRD: (B,L) → converge to (T,L)
        steps = [
            ((2, 0), "Start: (B, L)", YELLOW),
            ((0, 0), "P1's BR to L: T  (4>1>0)", P1_COLOR),
            ((0, 0), "P2's BR to T: L  (4>1>0)", P2_COLOR),
        ]

        prev_center = cell_centers[(2, 0)]
        dot = Dot(prev_center, color=YELLOW, radius=0.18)
        lbl = Text(steps[0][1], font_size=18, color=steps[0][2]).to_edge(RIGHT).shift(UP * 2)
        self.play(FadeIn(dot), Write(lbl))
        self.wait(0.5)

        for (i, j), label_str, color in steps[1:]:
            new_center = cell_centers[(i, j)]
            arrow = Arrow(prev_center, new_center, color=color,
                          buff=0.22, stroke_width=3, max_tip_length_to_length_ratio=0.2)
            new_lbl = Text(label_str, font_size=18, color=color).to_edge(RIGHT).shift(UP * 2)
            self.play(GrowArrow(arrow), Transform(lbl, new_lbl))
            self.play(dot.animate.move_to(new_center))
            prev_center = new_center
            self.wait(0.6)

        # Highlight NE at (T, L)
        ne_rect = SurroundingRectangle(pay_texts[0], color=NE_COLOR, buff=0.2, stroke_width=3)
        ne_text = Text("Nash Equilibrium: (T, L)", font_size=22, color=NE_COLOR)
        ne_text.next_to(ne_rect, RIGHT, buff=0.25)
        self.play(Create(ne_rect), Write(ne_text))
        self.wait(2)

        self.play(FadeOut(VGroup(
            heading, cells, pay_texts, row_labels, col_labels,
            p1_lbl, p2_lbl, description, dot, lbl, ne_rect, ne_text, arrow
        )))

    # ── Scene 4 : Mixed-Strategy NE via BR curve intersection ────────────────
    def scene_mixed_strategy(self):
        """
        Rock-Paper-Scissors: unique mixed NE at (1/3, 1/3, 1/3).
        We simplify to a 2-action matching-pennies game to show BR curves.

        Matching Pennies:
            P2: H   T
        P1 H: +1,-1  -1,+1
        P1 T: -1,+1  +1,-1

        P1 mixes H with prob p, P2 mixes H with prob q.
        P1's expected payoff = q·1 + (1-q)·(-1) = 2q - 1  when P1=H
                             = q·(-1) + (1-q)·1 = 1 - 2q   when P1=T
        P1 indifferent when 2q-1 = 1-2q → q = 1/2
        P2's BR similarly → p = 1/2
        NE: (p=1/2, q=1/2)
        """
        heading = Text("Mixed-Strategy Nash Equilibrium", font_size=34, color=TITLE_COLOR).to_edge(UP)
        subhead = Text("Matching Pennies", font_size=22, color=GRAY_LIGHT).next_to(heading, DOWN, buff=0.1)
        self.play(Write(heading), FadeIn(subhead))

        # Axes
        ax = Axes(
            x_range=[0, 1, 0.25],
            y_range=[0, 1, 0.25],
            x_length=5.5,
            y_length=5.5,
            axis_config={"include_numbers": True, "font_size": 20, "color": WHITE},
            tips=True,
        ).shift(DOWN * 0.3)

        x_label = ax.get_x_axis_label(
            MathTex(r"q\;(\text{P2 prob of H})", font_size=22), edge=RIGHT, direction=RIGHT
        )
        y_label = ax.get_y_axis_label(
            MathTex(r"p\;(\text{P1 prob of H})", font_size=22), edge=UP, direction=UP
        )

        self.play(Create(ax), Write(x_label), Write(y_label))

        # ── Best-response correspondences ────────────────────────────────────
        # P1's BR: p=1 if q>1/2, p=0 if q<1/2, p∈[0,1] if q=1/2
        # Draw as a staircase in RED (P1 color)
        br_p1 = VGroup(
            ax.plot_line_graph(x_values=[0, 0.5], y_values=[0, 0],
                               line_color=P1_COLOR, stroke_width=3, add_vertex_dots=False),
            ax.plot_line_graph(x_values=[0.5, 0.5], y_values=[0, 1],
                               line_color=P1_COLOR, stroke_width=3, stroke_opacity=0.6,
                               add_vertex_dots=False),
            ax.plot_line_graph(x_values=[0.5, 1], y_values=[1, 1],
                               line_color=P1_COLOR, stroke_width=3, add_vertex_dots=False),
        )

        # P2's BR: q=1 if p>1/2, q=0 if p<1/2, q∈[0,1] if p=1/2
        # Note: axes are (q horizontal, p vertical), so P2's BR is a horizontal staircase
        br_p2 = VGroup(
            ax.plot_line_graph(x_values=[0, 0], y_values=[0, 0.5],
                               line_color=P2_COLOR, stroke_width=3, add_vertex_dots=False),
            ax.plot_line_graph(x_values=[0, 1], y_values=[0.5, 0.5],
                               line_color=P2_COLOR, stroke_width=3, stroke_opacity=0.6,
                               add_vertex_dots=False),
            ax.plot_line_graph(x_values=[1, 1], y_values=[0.5, 1],
                               line_color=P2_COLOR, stroke_width=3, add_vertex_dots=False),
        )

        p1_legend = VGroup(
            Line(ORIGIN, RIGHT * 0.5, color=P1_COLOR, stroke_width=3),
            Text("BR₁(q)", font_size=20, color=P1_COLOR)
        ).arrange(RIGHT, buff=0.15).to_corner(DR).shift(LEFT * 0.3 + UP * 0.9)

        p2_legend = VGroup(
            Line(ORIGIN, RIGHT * 0.5, color=P2_COLOR, stroke_width=3),
            Text("BR₂(p)", font_size=20, color=P2_COLOR)
        ).arrange(RIGHT, buff=0.15).next_to(p1_legend, UP, buff=0.2)

        self.play(Create(br_p1), Write(p1_legend))
        self.play(Create(br_p2), Write(p2_legend))
        self.wait(0.8)

        # Nash Equilibrium dot at (q=0.5, p=0.5)
        ne_dot = Dot(ax.coords_to_point(0.5, 0.5), color=NE_COLOR, radius=0.14)
        ne_label = MathTex(r"p^* = \tfrac{1}{2},\;q^* = \tfrac{1}{2}",
                           font_size=24, color=NE_COLOR)
        ne_label.next_to(ne_dot, UR, buff=0.2)
        self.play(FadeIn(ne_dot, scale=1.8), Write(ne_label))

        # Intuition text
        intuition = VGroup(
            Text("At (p*=½, q*=½) neither player", font_size=19, color=WHITE),
            Text("can improve by changing their mix.", font_size=19, color=WHITE),
        ).arrange(DOWN, buff=0.15).to_edge(DOWN).shift(UP * 0.3)
        self.play(FadeIn(intuition))
        self.wait(2.5)

        # Final theorem statement
        self.play(FadeOut(VGroup(
            heading, subhead, ax, x_label, y_label,
            br_p1, br_p2, p1_legend, p2_legend, ne_dot, ne_label, intuition
        )))

        theorem = VGroup(
            Text("Nash's Existence Theorem", font_size=34, color=NE_COLOR),
            MathTex(
                r"\text{Every finite game has at least one Nash Equilibrium}",
                font_size=26, color=WHITE
            ),
            MathTex(
                r"\text{(possibly in mixed strategies).}",
                font_size=26, color=GRAY_LIGHT
            ),
        ).arrange(DOWN, buff=0.4).move_to(ORIGIN)

        self.play(FadeIn(theorem, shift=UP * 0.2))
        self.wait(3)
        self.play(FadeOut(theorem))
