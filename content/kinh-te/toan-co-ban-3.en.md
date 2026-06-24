---
title: "Toán Cơ Bản Cho Kinh Tế (Phần 3): Tối Ưu Hóa Có Ràng Buộc"
date: 2026-03-01T12:00:00+07:00
draft: false
categories: ["kinh-te", "toan-hoc"]
tags: ["toan-kinh-te", "toi-uu-hoa", "lagrange"]
collections: ["Toán Cơ Bản Cho Kinh Tế"]
math: true
---

Hầu hết các quyết định trong nền kinh tế thực không bao giờ là không bị giới hạn. Trái lại, nó là một quá trình phân bổ các nguồn lực khan hiếm: ngân sách, thời gian, nguyên vật liệu,...

Điều này đòi hỏi các công cụ mạnh mẽ hơn để tối ưu hóa thay vì chỉ tìm điểm cực tiểu/đại của hàm. Phương pháp nhân tử Lagrange (Lagrange Multipliers) là một trong những công cụ không thể thiếu trong balo của mọi nhà kinh tế.

## 1. Phương Pháp Nhân Tử Lagrange

Trong lý thuyết tiêu dùng, giả sử người tiêu dùng có một hàm độ thỏa dụng $U(x, y)$ phụ thuộc vào số lượng tiêu dùng hai hàng hóa $x$ và $y$. Bài toán là cần tối đa hóa sự thỏa mãn này, với giới hạn ngân sách là $M$:

$$ \max U(x,y) \quad \text{s.t.} \quad P_x x + P_y y = M $$

Ở đây, $P_x$ và $P_y$ là giá của hai mặt hàng.

Ta lập một hàm phụ trợ, gọi là hàm Lagrange:

$$ \mathcal{L}(x, y, \lambda) = U(x, y) + \lambda (M - P_x x - P_y y) $$

## 2. Ý Nghĩa Của Nhân Tử Lagrange $\lambda$

Đạo hàm bậc nhất theo từng biến $x, y$ và $\lambda$ rồi cho bằng 0 sẽ dẫn đến hệ phương trình:

1. $\frac{\partial \mathcal{L}}{\partial x} = \frac{\partial U}{\partial x} - \lambda P_x = 0$
2. $\frac{\partial \mathcal{L}}{\partial y} = \frac{\partial U}{\partial y} - \lambda P_y = 0$
3. $\frac{\partial \mathcal{L}}{\partial \lambda} = M - P_x x - P_y y = 0$

Từ 2 phương trình đầu, ta có:
$$ \frac{\partial U / \partial x}{P_x} = \frac{\partial U / \partial y}{P_y} = \lambda $$

Ý nghĩa kinh tế của $\lambda$ là vô cùng sâu sắc: $\lambda$ biểu thị cho **giá trị biên của ngân sách**. Nói cách khác, nếu ngân sách $M$ tăng thêm 1 đơn vị, độ thỏa mãn tổng thể $U$ sẽ tăng thêm chính xác $\lambda$ đơn vị.
