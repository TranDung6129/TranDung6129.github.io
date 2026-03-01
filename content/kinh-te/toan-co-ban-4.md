---
title: "Toán Cơ Bản Cho Kinh Tế (Phần 4): Tích Phân và Thặng Dư"
date: 2026-03-01T13:00:00+07:00
draft: false
categories: ["kinh-te", "toan-hoc"]
tags: ["toan-kinh-te", "vi-tich-phan"]
collections: ["Toán Cơ Bản Cho Kinh Tế"]
math: true
---

Nếu như đạo hàm giải quyết bài toán cận biên ở những mức thay đổi cực kỳ nhỏ, thì tích phân giải quyết bài toán "đi ngược lại" từ tốc độ thay đổi cận biên để tìm tổng các giá trị tích lũy.

## 1. Thặng Dư Tiêu Dùng (Consumer Surplus)

Giả sử hàm cầu của thị trường có dạng: $P = D(Q)$, trong đó $P$ là mức giá tối đa mà người tiêu dùng sẵng sàng trả cho đơn vị sản phẩm thứ $Q$.

Tại điểm cân bằng thị trường $(Q_e, P_e)$, không phải tất cả mọi người đều bằng lòng mua ở giá $P_e$. Nhiều người lẽ ra sẵn lòng mua một mức giá cao hơn, nhưng nhờ cơ chế thị trường, họ chỉ phải trả có $P_e$. Giá trị phúc lợi (welfare) tăng lên của họ được gọi là Thặng dư tiêu dùng (CS):

$$ CS = \int_{0}^{Q_e} [D(Q) - P_e] dQ $$

## 2. Thặng Dư Sản Xuất (Producer Surplus)

Ngược lại, người sản xuất cũng có một đường Cung (Supply curve) đại diện cho mức giá tối thiểu mà họ chấp nhận bán: $P = S(Q)$.

Nhờ bán được ở một mức giá chung $P_e$, doanh nghiệp kiếm được lợi nhuận lớn hơn mức hòa vốn.

$$ PS = \int_{0}^{Q_e} [P_e - S(Q)] dQ $$

## 3. Tổng Phúc Lợi Xã Hội

Sự can thiệp của chính phủ (ví dụ thu thuế thu nhập, thuế thương mại) sẽ dễ dàng được đánh giá qua công cụ tích phân. Khi có một sắc thuế được áp vào thị trường:

$$ \text{Total Welfare} = CS + PS + \text{Tax Revenue} $$

Dễ dàng sử dụng hình học tích phân, ta có thể đánh giá được Deadweight Loss (Phần mất mát trắng) khi chính phủ can thiệp vào thị trường, từ đó so sánh xem chính sách này có làm xã hội kém đi hay không.
