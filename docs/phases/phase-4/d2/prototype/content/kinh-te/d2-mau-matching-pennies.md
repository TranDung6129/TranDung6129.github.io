---
title: "Bộ ví dụ D2: Matching Pennies"
subtitle: "Một bài toán nhỏ dùng đủ các khối nội dung: định nghĩa, công thức đánh số, bảng, biểu đồ, mã và khung hình video."
date: 2026-11-24T09:00:00+07:00
draft: false
categories: ["kinh-te", "toan-hoc"]
tags: ["ly-thuyet-tro-choi", "nash"]
math: true
---

Trang này là **bản mẫu để duyệt** chuẩn nội dung và media (D2). Bài toán được chọn vì nó đủ nhỏ để thấy hết mọi khối, nhưng vẫn có một kết luận thật: trò chơi không có cân bằng thuần, chỉ có một cân bằng hỗn hợp.

## 1. Bài toán

{{< callout definition "Matching Pennies" >}}
Hai người chơi cùng lúc chọn **H** (sấp) hoặc **T** (ngửa). Nếu hai đồng xu khớp nhau, người chơi 1 thắng 1 đơn vị; nếu khác nhau, người chơi 2 thắng 1 đơn vị. Đây là trò chơi tổng bằng không.
{{< /callout >}}

{{< table caption="Ma trận lợi ích (người chơi 1, người chơi 2)." >}}
|   | **H** | **T** |
|---|:---:|:---:|
| **H** | (+1, −1) | (−1, +1) |
| **T** | (−1, +1) | (+1, −1) |
{{< /table >}}

{{< callout warning >}}
Không có cặp chiến lược thuần nào là cân bằng: ở mọi ô của Bảng 1, luôn có một người chơi muốn đổi lựa chọn.
{{< /callout >}}

## 2. Chiến lược hỗn hợp

Gọi $p$ là xác suất người chơi 1 chọn H và $q$ là xác suất người chơi 2 chọn H. Lợi ích kỳ vọng của người chơi 1 khi chọn H và khi chọn T là

\begin{equation}
u_1(\mathrm{H}, q) = q - (1 - q) = 2q - 1, \qquad u_1(\mathrm{T}, q) = 1 - 2q. \label{eq:u1}
\end{equation}

Người chơi 1 chỉ sẵn lòng trộn hai lựa chọn khi hai giá trị trong {{< eqref "eq:u1" >}} bằng nhau:{{< note >}}Đây là *điều kiện bàng quan*: trong một cân bằng hỗn hợp, mọi chiến lược được dùng với xác suất dương phải cho cùng lợi ích kỳ vọng.{{< /note >}}

\begin{equation}
2q - 1 = 1 - 2q \quad\Longrightarrow\quad q^* = \tfrac{1}{2}. \label{eq:qstar}
\end{equation}

Lập luận tương tự cho người chơi 2 cho $p^* = \tfrac12$. Vậy cặp $(p^*, q^*) = (\tfrac12, \tfrac12)$ trong {{< eqref "eq:qstar" >}} là cân bằng duy nhất.

{{< callout theorem "Định lý tồn tại" >}}
Mọi trò chơi hữu hạn đều có ít nhất một cân bằng Nash trong chiến lược hỗn hợp {{< cite "nash1950" >}}.
{{< /callout >}}

{{< plot src="matching-pennies-br.svg" caption="Đường phản ứng tốt nhất $\mathrm{BR}_1(q)$ và $\mathrm{BR}_2(p)$. Chúng chỉ cắt nhau tại $(\tfrac12, \tfrac12)$, đúng nghiệm của phương trình (2)." alt="Hai đường phản ứng tốt nhất hình bậc thang trong hình vuông đơn vị, cắt nhau tại điểm (1/2, 1/2), có ghi chú viết tay: cân bằng Nash." >}}

## 3. Kiểm tra bằng mã

```python
from fractions import Fraction as F

def indifference(a, b, c, d):
    """q làm người chơi hàng bàng quan: a·q + b·(1−q) = c·q + d·(1−q)."""
    return F(d - b, (a - b) - (c - d))

print(indifference(+1, -1, -1, +1))  # 1/2
```

## 4. Video: khung hình storyboard

{{< storyboard >}}

## Tài liệu tham khảo

{{< references >}}
