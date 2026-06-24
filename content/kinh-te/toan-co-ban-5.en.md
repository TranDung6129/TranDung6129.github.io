---
title: "Toán Cơ Bản Cho Kinh Tế (Phần 5): Đại Số Tuyến Tính"
date: 2026-03-01T14:00:00+07:00
draft: false
categories: ["kinh-te", "toan-hoc"]
tags: ["toan-kinh-te", "dai-so-tuyen-tinh", "ma-tran"]
collections: ["Toán Cơ Bản Cho Kinh Tế"]
math: true
---

Nếu Vi tích phân giúp chúng ta giải được quyết định của *một* doanh nghiệp hay *một* người tiêu dùng, thì đại số tuyến tính là nền tảng cốt lõi đưa kinh tế học vươn lên thành một môn học của *hàng nghìn* doanh nghiệp tương tác cùng nhau.

## 1. Ma Trận Bù Trừ (Leontief Input-Output Model)

Một trong những ứng dụng lớn nhất của đại số tuyến tính vào kinh tế học là mô hình Input-Output của Wassily Leontief (người đoạt giải Nobel Kinh tế năm 1973). Cấu trúc của nền kinh tế được biểu diễn qua ma trận giao dịch công nghiệp. 

Nguyên tắc cấu thành cơ bản: một sản phẩm A muốn được sản xuất ra, cần sử dụng những loại nguyên liệu thô đầu vào B, C, D (ví dụ: thép cần quặng, than đá, điện, v.v.). Điều đó dẫn đến một ma trận quan hệ giữa các ngành trong nền kinh tế $A$, và tổng lượng tiêu thụ $X$. Dựa vào công thức đại số:

$$ X = (I - A)^{-1} D $$

Trong đó:
- $X$: Vector sản lượng tổng của toàn nền kinh tế
- $I$: Ma trận đơn vị
- $A$: Ma trận hệ số đầu vào (ví dụ ngành $i$ cần bao nhiêu nguyên liệu từ ngành $j$)
- $D$: Vector nhu cầu cuối của toàn xã hội

## 2. Mô Hình Phân Tích Chuỗi Markov

Ngoài Input-Output model, đại số tuyến tính kết hợp với lý thuyết xác suất đã tạo ra mô hình Chuỗi Markov nhằm dự đoán trạng thái tương lai của thu nhập, cấu trúc doanh nghiệp và tình trạng việc làm.

Ví dụ, ta gọi ma trận $P$ là ma trận dịch chuyển xác suất tìm thấy việc làm hoặc mất việc (transition matrix). Sự phân bổ dài hạn (Steady-state distribution) của thất nghiệp được tìm thấy ngay lập tức nhờ vào việc tìm **vector riêng (eigenvector)** của ma trận $P$ ứng với giá trị riêng $\lambda = 1$.

Chính nhờ những ma trận nhiều chiều này, Machine Learning hiện đại và các thuật toán dự báo của trí tuệ nhân tạo (AI) ngày nay mới có thể xử lý lượng Big Data khổng lồ ở giới tài chính định lượng trong chưa tới một phần nghìn giây.
