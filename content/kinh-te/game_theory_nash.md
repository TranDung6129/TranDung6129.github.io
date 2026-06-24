---
title: "Game Theory & Nash Equilibrium: From Intuition to Fixed Points"
date: 2025-08-01T09:00:00+07:00
draft: false
tags: ["game-theory", "mathematics", "optimization", "economics", "AI"]
categories: ["Applied Mathematics"]
math: true
description: >
  A rigorous but accessible tour of strategic-form games, dominant strategies,
  best-response correspondences, and Nash's fixed-point existence proof —
  with an interactive 2×2 bimatrix explorer and Manim animation.
---

<!-- Video produced by manim/game_theory_nash.py -->
<video
  src="/videos/game_theory_nash.mp4"
  controls
  width="100%"
  style="border-radius:8px; margin-bottom:1.5rem;"
  poster="/images/game_theory_nash_poster.png">
  Your browser does not support the video tag.
</video>

## 1. Motivation: Why Do We Need Game Theory?

Classical optimization asks: *given an objective function, find its maximiser.*
The catch — the objective function depends solely on *your own* choices.

In most real situations that assumption collapses.
Whether you're designing an auction mechanism, routing packets across a network,
training two competing neural networks in a GAN, or deciding whether to
vaccinate, **your best action depends on what everyone else does.**

Game theory provides the mathematics to reason about these *strategic interactions*.

---

## 2. Formal Setup: Strategic-Form Games

A **strategic-form game** (also called a *normal-form game*) is a triple

$$
G = (N,\, \{S_i\}_{i \in N},\, \{u_i\}_{i \in N})
$$

where:

| Symbol | Meaning |
|--------|---------|
| $N = \{1, 2, \ldots, n\}$ | Finite set of **players** |
| $S_i$ | Finite set of **pure strategies** for player $i$ |
| $u_i : S_1 \times \cdots \times S_n \to \mathbb{R}$ | **Payoff function** (utility / reward) for player $i$ |

A **strategy profile** is a tuple $s = (s_1, \ldots, s_n) \in S := \prod_i S_i$.

Notation: we write $s_{-i}$ for the profile of all players *except* $i$, so
$s = (s_i, s_{-i})$.

### 2.1 Mixed Strategies

A **mixed strategy** for player $i$ is a probability distribution over $S_i$:

$$
\sigma_i \in \Delta(S_i) := \left\{ p \in \mathbb{R}^{|S_i|}_{\geq 0} :
  \sum_{s_i \in S_i} p(s_i) = 1 \right\}
$$

Players mix *independently*.
The **expected payoff** under a mixed profile $\sigma = (\sigma_1, \ldots, \sigma_n)$ is:

$$
U_i(\sigma) = \sum_{s \in S} u_i(s) \prod_{j \in N} \sigma_j(s_j)
$$

This is *multilinear* in each player's own mixing probabilities — a fact we will
exploit repeatedly.

---

## 3. Dominant Strategies and Iterated Elimination

### 3.1 Dominant Strategies

Strategy $s_i$ **strictly dominates** $s_i'$ if

$$
u_i(s_i, s_{-i}) > u_i(s_i', s_{-i}) \quad \forall\, s_{-i} \in S_{-i}
$$

A rational player *never plays* a strictly dominated strategy.

**Iterated Elimination of Strictly Dominated Strategies (IESDS):**
Remove dominated strategies from each player's set, update the game, and repeat.
The order of elimination does not matter; the outcome is unique.

### 3.2 The Prisoner's Dilemma

The canonical example is two suspects simultaneously choosing to *Cooperate* (C)
or *Defect* (D). Payoffs represent years in prison (lower is better):

$$
\begin{array}{c|cc}
 & \textbf{C} & \textbf{D} \\
\hline
\textbf{C} & (-1,\,-1) & (-3,\;0) \\
\textbf{D} & (0,\;-3)  & (-2,\,-2)
\end{array}
$$

For Player 1, regardless of Player 2's choice:

$$
u_1(D, C) = 0 > -1 = u_1(C, C), \qquad u_1(D, D) = -2 > -3 = u_1(C, D)
$$

So *D* strictly dominates *C* for **both** players.
IESDS collapses the game to the unique profile $(D, D)$.

---

## 4. Nash Equilibrium

### 4.1 Definition

A strategy profile $\sigma^* = (\sigma_1^*, \ldots, \sigma_n^*)$ is a
**Nash Equilibrium** if and only if

$$
\boxed{U_i(\sigma_i^*, \sigma_{-i}^*) \;\geq\; U_i(\sigma_i, \sigma_{-i}^*)
\quad \forall\, \sigma_i \in \Delta(S_i),\; \forall\, i \in N}
$$

Equivalently, $\sigma_i^*$ is a **best response** to $\sigma_{-i}^*$ for
every player $i$.

No player has a unilateral incentive to deviate — the profile is a
*self-enforcing* prediction.

### 4.2 Best-Response Correspondence

Define player $i$'s **best-response correspondence**:

$$
\text{BR}_i(\sigma_{-i}) \;:=\;
\arg\max_{\sigma_i \in \Delta(S_i)}\; U_i(\sigma_i, \sigma_{-i})
$$

Since $U_i$ is linear in $\sigma_i$ (given fixed $\sigma_{-i}$), the best
response is *always a pure strategy or a convex combination of equally-best
pure strategies* — i.e., the argmax is achieved on the vertices unless the
player is exactly indifferent.

A Nash Equilibrium is precisely a **fixed point** of the joint best-response
map:

$$
\sigma^* \;\in\; \text{BR}(\sigma^*) \;:=\; \prod_{i \in N} \text{BR}_i(\sigma_{-i}^*)
$$

---

## 5. Existence: Nash's Theorem

> **Theorem (Nash, 1950).** *Every finite strategic-form game has at least one
> Nash Equilibrium in mixed strategies.*

**Proof sketch via Kakutani's fixed-point theorem.**

1. The mixed-strategy simplex $\Delta := \prod_i \Delta(S_i)$ is compact and convex.
2. The correspondence $\text{BR}: \Delta \rightrightarrows \Delta$ is
   *upper hemicontinuous* (by the maximum theorem, since $U_i$ is continuous
   and $\Delta(S_i)$ is compact) and has *non-empty, convex values* (the set
   of maximisers of a linear function over a convex set is convex).
3. By **Kakutani's fixed-point theorem**, any upper hemicontinuous correspondence
   from a compact convex set to itself with non-empty convex values admits a
   fixed point.
4. That fixed point $\sigma^*$ satisfies $\sigma^* \in \text{BR}(\sigma^*)$,
   which is exactly the Nash Equilibrium condition. $\blacksquare$

---

## 6. Mixed-Strategy NE in 2×2 Games

### 6.1 Indifference Principle

At a fully mixed NE (where both players mix over all their strategies),
*each player must be indifferent* among all pure strategies in their support.
If a player strictly preferred one pure strategy, they would put weight 1 on it
— contradicting the mixing assumption.

### 6.2 Matching Pennies

$$
\begin{array}{c|cc}
 & \textbf{H} & \textbf{T} \\
\hline
\textbf{H} & (+1,\,-1) & (-1,\;+1) \\
\textbf{T} & (-1,\;+1) & (+1,\,-1)
\end{array}
$$

Let Player 1 mix H with probability $p$ and Player 2 mix H with probability $q$.

**Player 1's indifference condition** (makes Player 2 willing to mix):

$$
q(+1) + (1-q)(-1) \;=\; q(-1) + (1-q)(+1)
\;\Longrightarrow\; 2q - 1 = 1 - 2q \;\Longrightarrow\; q^* = \tfrac{1}{2}
$$

By symmetry, $p^* = \tfrac{1}{2}$.

The unique NE is $\sigma^* = \bigl(\tfrac{1}{2}, \tfrac{1}{2}\bigr)$ for both players.
Expected payoff for each player: $U_i = 0$.

This illustrates a crucial insight: **you choose your mixing probability to
make your opponent indifferent, not to maximise your own payoff directly.**

### 6.3 General 2×2 Formula

For a bimatrix game $(A, B)$ with $A, B \in \mathbb{R}^{2 \times 2}$,
defining $\Delta a = a_{11} - a_{12} - a_{21} + a_{22}$ and similarly $\Delta b$:

$$
q^* = \frac{a_{22} - a_{12}}{\Delta a}, \qquad
p^* = \frac{b_{22} - b_{21}}{\Delta b}
$$

provided $\Delta a \neq 0$, $\Delta b \neq 0$, and both $p^*, q^* \in (0,1)$.

---

## 7. Best-Response Dynamics

**Best-Response Dynamics (BRD)** is a learning algorithm that converges to NE
in certain game classes:

$$
s_i^{(t+1)} = \arg\max_{s_i \in S_i}\; u_i(s_i,\; s_{-i}^{(t)})
$$

Each player simultaneously plays a best response to yesterday's profile.

**Convergence guarantees:**
- In **dominance-solvable** games: always converges to the unique pure NE.
- In **potential games** (Monderer & Shapley, 1996): convergence guaranteed.
- In **zero-sum games**: simultaneous BRD may cycle; no convergence guarantee
  for pure strategies.

The Prisoner's Dilemma converges in one step (D strictly dominates, so BRD
immediately reaches $(D, D)$ regardless of initial state).

---

## 8. Connection to the Visualization

The [Manim animation](#) above walks through four scenes:

1. **Introduction** — formal NE definition on screen.
2. **Prisoner's Dilemma matrix** — payoff matrix built cell by cell, dominant
   strategy arrows drawn, NE highlighted.
3. **Best-response dynamics** — arrows trace BRD convergence on a $3 \times 3$
   coordination game to the pure NE $(T, L)$.
4. **Mixed-strategy NE** — the BR correspondences for Matching Pennies drawn as
   staircase functions on the $(q, p)$ unit square; their unique intersection at
   $(\tfrac{1}{2}, \tfrac{1}{2})$ is the mixed NE.

---

## 9. Extensions and Applications

### 10.1 Correlated Equilibrium (Aumann, 1974)

A weaker solution concept: players observe a common signal and respond optimally.
Every NE is a correlated equilibrium, but not vice versa.
Correlated equilibria can be computed in polynomial time via linear programming
(unlike NE in $n$-player games, which is PPAD-complete).

### 10.2 Evolutionary Stable Strategies

In large populations, **Evolutionary Stable Strategies (ESS)** refine the NE
concept: a strategy $\sigma^*$ is ESS if a population playing $\sigma^*$ cannot
be invaded by a small fraction playing any $\sigma \neq \sigma^*$.

### 10.3 Applications in AI & Engineering

| Domain | Role of NE |
|--------|-----------|
| **Multi-agent RL** | NE as training target in competitive settings; fictitious play, counterfactual regret minimisation (CFR) |
| **Adversarial ML** | GAN minimax $\min_G \max_D V(D,G)$; Nash point of the zero-sum game |
| **Network routing** | Wardrop equilibrium in congestion games |
| **Mechanism design** | Auction design to incentivise truthful bidding (Vickrey–Clarke–Groves) |
| **Cybersecurity** | Attacker–defender games; optimal patching allocation |

### 10.4 Computational Complexity

- **2-player zero-sum games**: NE computable via linear programming in
  polynomial time (von Neumann's minimax theorem).
- **2-player general-sum games**: NE is PPAD-complete
  (Daskalakis, Goldberg & Papadimitriou, 2009).
- **$n$-player games ($n \geq 3$)**: NE remains PPAD-hard;
  approximate NE achievable in quasi-polynomial time for small approximation.

---

## 10. Summary

$$
\underbrace{G = (N, \{S_i\}, \{u_i\})}_{\text{strategic-form game}}
\;\xrightarrow{\;\text{Kakutani}\;}\;
\underbrace{\sigma^* \in \text{BR}(\sigma^*)}_{\text{Nash Equilibrium}}
$$

Key takeaways:

- A Nash Equilibrium is a **fixed point of the best-response map** — not
  necessarily a global social optimum (cf. Prisoner's Dilemma).
- Existence is guaranteed in every finite game, but computing it is generically
  hard.
- The **indifference principle** is the workhorse for finding mixed-strategy NE
  in small games.
- Best-response dynamics converges in structured classes (potential games,
  dominance-solvable games) but can cycle in zero-sum games.
- NE underpins multi-agent RL, GANs, mechanism design, and network economics.

---

## 11. Interactive Exploration

The component below lets you edit any 2×2 bimatrix game via sliders.
It computes and displays:

- **All pure-strategy NE** (highlighted in the normal-form table)
- **The unique mixed-strategy NE** $(p^*, q^*)$ when it exists in $(0,1)^2$
- **Expected payoff curves** $U_1(p)$ and $U_2(p)$ as a function of Player 1's
  mixing probability, at a fixed $q$ you control

Suggested experiments:

| Preset | What to observe |
|--------|----------------|
| Prisoner's Dilemma | Unique pure NE at $(D,D)$; no mixed NE in $(0,1)^2$ |
| Battle of the Sexes | Two pure NE; mixed NE exists but is Pareto-dominated by both pure NE |
| Matching Pennies | No pure NE; unique mixed NE at $p^*=q^*=0.5$ |
| Stag Hunt | Two pure NE; the Pareto-optimal $(T,L)$ is risk-dominated by $(B,R)$ |

{{< react name="NashEquilibriumSim" >}}

---

## References

1. Nash, J. F. (1950). *Equilibrium points in n-person games.*
   Proceedings of the National Academy of Sciences, 36(1), 48–49.
2. Kakutani, S. (1941). *A generalization of Brouwer's fixed point theorem.*
   Duke Mathematical Journal, 8(3), 457–459.
3. Daskalakis, C., Goldberg, P. W., & Papadimitriou, C. H. (2009).
   *The complexity of computing a Nash equilibrium.*
   SIAM Journal on Computing, 39(1), 195–259.
4. Monderer, D., & Shapley, L. S. (1996). *Potential games.*
   Games and Economic Behavior, 14(1), 124–143.
5. Shoham, Y., & Leyton-Brown, K. (2008).
   *Multiagent Systems: Algorithmic, Game-Theoretic, and Logical Foundations.*
   Cambridge University Press.
