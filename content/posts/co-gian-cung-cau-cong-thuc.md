---
title: "Độ Co Giãn Cung Cầu: Chứng Minh và Giải Thích Công Thức"
date: 2024-12-12T10:00:00+07:00
slug: co-gian-cung-cau-cong-thuc
description: "Phân tích chi tiết về độ co giãn cung cầu, từ chứng minh toán học đến ứng dụng thực tiễn trong kinh tế học"
tags: ["kinh-te", "vi-mo", "toan-hoc", "phan-tich"]
categories: ["Kinh Tế"]
math: true
draft: false
---

## Giới Thiệu

Độ co giãn là một trong những khái niệm cơ bản nhất trong kinh tế học, đo lường mức độ nhạy cảm của một biến số khi biến số khác thay đổi. Trong bài viết này, chúng ta sẽ đi sâu vào việc chứng minh toán học và giải thích các công thức co giãn cung cầu.

## 1. Định Nghĩa và Khái Niệm Cơ Bản

### 1.1 Độ Co Giãn Của Cầu Theo Giá (Price Elasticity of Demand)

Độ co giãn của cầu theo giá đo lường mức độ thay đổi tương đối của lượng cầu khi giá thay đổi:

$$E_d = \frac{\% \Delta Q_d}{\% \Delta P} = \frac{\frac{\Delta Q_d}{Q_d}}{\frac{\Delta P}{P}}$$

### 1.2 Độ Co Giãn Của Cung Theo Giá (Price Elasticity of Supply)

Tương tự, độ co giãn của cung theo giá:

$$E_s = \frac{\% \Delta Q_s}{\% \Delta P} = \frac{\frac{\Delta Q_s}{Q_s}}{\frac{\Delta P}{P}}$$

## 2. Chứng Minh Công Thức Co Giãn

### 2.1 Từ Định Nghĩa Đến Công Thức

Xuất phát từ định nghĩa cơ bản:

$$E_d = \frac{\% \Delta Q_d}{\% \Delta P}$$

Ta có:
$$\% \Delta Q_d = \frac{\Delta Q_d}{Q_d} \times 100\%$$
$$\% \Delta P = \frac{\Delta P}{P} \times 100\%$$

Do đó:
$$E_d = \frac{\frac{\Delta Q_d}{Q_d} \times 100\%}{\frac{\Delta P}{P} \times 100\%} = \frac{\Delta Q_d}{Q_d} \times \frac{P}{\Delta P}$$

### 2.2 Công Thức Vi Phân

Khi $\Delta P \to 0$, ta có công thức vi phân:

$$E_d = \frac{dQ_d}{dP} \times \frac{P}{Q_d}$$

**Chứng minh:**

Giả sử hàm cầu có dạng $Q_d = f(P)$. Theo định nghĩa đạo hàm:

$$\frac{dQ_d}{dP} = \lim_{\Delta P \to 0} \frac{\Delta Q_d}{\Delta P}$$

Khi đó:
$$E_d = \lim_{\Delta P \to 0} \frac{\Delta Q_d}{\Delta P} \times \frac{P}{Q_d} = \frac{dQ_d}{dP} \times \frac{P}{Q_d}$$

## 3. Các Loại Co Giãn Đặc Biệt

### 3.1 Co Giãn Đơn Vị ($|E_d| = 1$)

Khi $|E_d| = 1$, phần trăm thay đổi của lượng cầu bằng phần trăm thay đổi của giá.

**Ví dụ:** Hàm cầu $Q_d = \frac{k}{P}$ (k là hằng số)

$$E_d = \frac{dQ_d}{dP} \times \frac{P}{Q_d} = \frac{-k}{P^2} \times \frac{P}{\frac{k}{P}} = -1$$

### 3.2 Co Giãn Hoàn Hảo ($|E_d| = \infty$)

Đường cầu nằm ngang, lượng cầu thay đổi vô hạn khi giá thay đổi nhỏ.

### 3.3 Co Giãn Bằng Không ($E_d = 0$)

Đường cầu thẳng đứng, lượng cầu không đổi khi giá thay đổi.

## 4. Tính Chất Toán Học

### 4.1 Định Lý Co Giãn và Logarit

**Định lý:** Nếu $Q_d = AP^{\alpha}$ thì $E_d = \alpha$

**Chứng minh:**
$$Q_d = AP^{\alpha}$$
$$\frac{dQ_d}{dP} = A\alpha P^{\alpha-1}$$

$$E_d = \frac{dQ_d}{dP} \times \frac{P}{Q_d} = A\alpha P^{\alpha-1} \times \frac{P}{AP^{\alpha}} = \alpha$$

### 4.2 Co Giãn Chéo và Phép Nhân

Đối với hai hàng hóa X và Y:
$$E_{xy} = \frac{dQ_x}{dP_y} \times \frac{P_y}{Q_x}$$

## 5. Phương Pháp Tính Toán Thực Tiễn

### 5.1 Công Thức Midpoint

Để tránh sự khác biệt khi tính từ điểm này sang điểm khác:

$$E_d = \frac{\frac{Q_2 - Q_1}{\frac{Q_1 + Q_2}{2}}}{\frac{P_2 - P_1}{\frac{P_1 + P_2}{2}}}$$

### 5.2 Ví Dụ Tính Toán

Giả sử giá tăng từ 10 lên 12, lượng cầu giảm từ 100 xuống 80:

$$E_d = \frac{\frac{80-100}{\frac{100+80}{2}}}{\frac{12-10}{\frac{10+12}{2}}} = \frac{\frac{-20}{90}}{\frac{2}{11}} = -1.22$$

## 6. Ứng Dụng Trong Phân Tích Kinh Tế

### 6.1 Chính Sách Thuế

Khi chính phủ áp thuế, tác động lên giá phụ thuộc vào co giãn cung cầu:

$$\frac{dP}{dT} = \frac{E_s}{E_s - E_d}$$

### 6.2 Phân Tích Thị Trường

Co giãn giúp doanh nghiệp đưa ra quyết định định giá:
- $|E_d| > 1$: Giảm giá để tăng doanh thu
- $|E_d| < 1$: Tăng giá để tăng doanh thu

## 7. Giới Hạn và Phê Phán

### 7.1 Giả Định Ceteris Paribus

Co giãn giả định các yếu tố khác không đổi, điều này hiếm khi xảy ra trong thực tế.

### 7.2 Tính Phi Tuyến

Trong thực tế, co giãn thường thay đổi theo điểm trên đường cầu.

## Kết Luận

Độ co giãn cung cầu là công cụ toán học mạnh mẽ trong phân tích kinh tế. Việc hiểu rõ chứng minh và ứng dụng các công thức giúp chúng ta có cái nhìn sâu sắc hơn về cơ chế thị trường và đưa ra các quyết định kinh tế hợp lý.

Tính chính xác của phép tính co giãn phụ thuộc vào chất lượng dữ liệu và tính ổn định của các mối quan hệ kinh tế. Trong nghiên cứu thực tiễn, cần kết hợp với các phương pháp phân tích khác để có kết luận đáng tin cậy.
