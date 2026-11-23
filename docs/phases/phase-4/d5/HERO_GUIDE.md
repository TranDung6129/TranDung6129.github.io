# Ảnh đầu bài (hero) — hướng dẫn tạo bằng AI

Dành cho: chủ trang, khi tạo ảnh minh hoạ cho một bài viết. Ảnh là **tuỳ chọn**: chỉ bài nào cần cảm hứng thị giác mới có.

## Phong cách cố định (để mọi ảnh đồng bộ với 4 ảnh hiện có)
- **Kỹ thuật:** tranh khắc / khắc đồng kiểu thế kỷ 18–19, nét gạch đan (cross-hatching), tông sepia–nâu đất trên nền giấy ngà. Điểm nhấn màu đất nung (terracotta) rất tiết chế.
- **Bố cục:** một vật thể hoặc cảnh trung tâm làm ẩn dụ cho ý chính của bài (ví dụ: xúc xắc cho xác suất, quả cầu thiên văn cho mô hình). Nền sạch, nhiều khoảng thở. Ánh sáng dịu từ trên trái.
- **Không có:**
  - chữ, số, ký hiệu toán viết sai;
  - logo, thương hiệu;
  - người thật hoặc gương mặt nhận ra được;
  - kiểu ảnh chụp như thật, ánh neon, gradient số.
- **Tỉ lệ:**
  - Đầu bài 16:9 (giao từ 1672 × 941 px trở lên).
  - Thẻ bài nổi bật 3:2 (từ 1200 × 800 px).
  - Đặt vật thể chính lệch nhẹ khỏi tâm, chừa vùng an toàn 10% ở mép để cắt không mất chi tiết.

## Mẫu câu lệnh (prompt)
```
An 18th–19th century copperplate engraving of {VẬT THỂ / CẢNH ẨN DỤ CHO BÀI}, fine cross-hatching,
warm sepia and brown ink on ivory paper, a few restrained terracotta accents, soft light from the
upper left, calm composition with generous empty paper around the subject, no text, no letters,
no numbers, no logos, no people, not photographic. Aspect ratio 16:9.
```
Gợi ý vật thể: chọn **một** hình ảnh cụ thể, không phải cảnh tổng hợp nhiều thứ.

## Giao file
- **File gốc:** PNG, đặt tên `epistemic_<slug-bài>.png`. Gửi kèm:
  - công cụ hoặc model đã dùng;
  - đường dẫn điều khoản sử dụng của công cụ;
  - prompt cuối cùng.
- **Phần mình làm:**
  - tạo bản WebP nhiều cỡ;
  - ghi hồ sơ nguồn gốc (`docs/design/ASSET-PROVENANCE.md`, `aiGenerated: true`);
  - viết alt text;
  - gắn ảnh vào bài bằng front matter `art: <khoá>`.
- **Nhãn:** dưới ảnh ghi "Minh hoạ", theo `VISUAL_ASSET_GUIDELINES.md`. Ảnh AI không bao giờ được dùng làm bằng chứng cho sự kiện, thí nghiệm hay người thật.

## Kiểm tra trước khi dùng
- [ ] Đúng phong cách và bảng màu, đặt cạnh 4 ảnh hiện có không bị lạc tông.
- [ ] Không chữ hoặc ký hiệu sai, không logo, không người.
- [ ] Điều khoản công cụ cho phép dùng thương mại (bạn xác nhận).
- [ ] Alt text mô tả đúng ảnh; ảnh liên quan thật tới bài.
