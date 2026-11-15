---
title: "Khám phá cân bằng Nash 2×2"
description: "Chỉnh ma trận lợi ích, chọn các trò chơi kinh điển và xem cân bằng thuần, cân bằng hỗn hợp và đường lợi ích kỳ vọng thay đổi theo."
date: 2025-08-01T09:00:00+07:00
weight: 1
math: true
tech: "React · Recharts"
requires: "Cần màn hình máy tính hoặc máy tính bảng xoay ngang; trên điện thoại hiển thị phần giải thích thay thế."
related: /kinh-te/game_theory_nash
---

Thí nghiệm này đi kèm bài luận về lý thuyết trò chơi và cân bằng Nash. Mỗi thanh trượt là một ô trong ma trận lợi ích của hai người chơi; mọi thay đổi được tính lại ngay. Phần mô tả bên dưới giữ nguyên tiếng Anh như trong bài gốc.

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
