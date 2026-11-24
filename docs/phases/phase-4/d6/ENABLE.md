# Bật các kênh D6 — hướng dẫn cho chủ trang

Mọi kênh đều **tắt** cho tới khi bạn điền thông tin. Điền xong thì commit; trang tự bật sau lần deploy kế tiếp.

## 1. Ủng hộ tự nguyện
1. Tạo trang ủng hộ của bạn (Ko-fi, Buy Me a Coffee, hoặc một trang ngân hàng/MoMo).
2. Trong `config/_default/params.toml`, mục `[support]`:
   - `url = "https://ko-fi.com/<tên-bạn>"`
   - `label = "Mời một ly cà phê"` (tuỳ chọn)
   - `qr = "/images/support-qr.png"` (tuỳ chọn; đặt ảnh vào `static/images/`)
3. Khối "Ủng hộ The Epistemic Diary" sẽ hiện ở cuối mỗi bài viết và ở trang Giới thiệu.

## 2. Liên kết mua sách (affiliate)
1. Đăng ký chương trình affiliate (Tiki, Fahasa, Shopee, Amazon…) và lấy liên kết cho **đúng cuốn sách** đã có trong thư viện.
2. Thêm vào mục của cuốn sách trong `data/resources.yaml` (Discover) và/hoặc `data/d1_resources.yaml` (Tài liệu chọn lọc):
   ```yaml
   - bib: shoham2008
     buy:
       - { store: "Tiki", url: "https://…", affiliate: true }
   ```
3. Dòng "Mua sách" và lời công khai hoa hồng sẽ tự hiện. Không ghi giá, không dùng lời mời mua gấp.

## 3. Đo lường không cookie (GoatCounter)
1. Tạo site miễn phí tại goatcounter.com, ví dụ mã `epistemic`.
2. Trong `config/_default/params.toml`: `goatcounter = "https://epistemic.goatcounter.com/count"`.
3. Chỉ bản build production mới tải script. Lượt xem, nguồn truy cập, và lượt bấm "Mua sách"/"Ủng hộ" (`buy:<cửa hàng>`, `support`) sẽ hiện trên bảng GoatCounter.
4. Thêm một câu về đo lường vào trang Giới thiệu khi bật.

## 4. Bài đề xuất do biên tập chọn
Trong front matter của một bài: `further: ["/kinh-te/toan-co-ban-5"]`. Các bài này hiện đầu tiên với nhãn "Biên tập chọn".
