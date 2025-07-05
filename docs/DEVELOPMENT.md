# Hướng dẫn phát triển - The Epistemic Journal

## 🚀 Setup môi trường phát triển

### Yêu cầu hệ thống

- Ruby >= 2.7
- Jekyll >= 4.0
- Bundler
- Git

### Cài đặt

1. **Clone repository**
   ```bash
   git clone https://github.com/TranDung6129/TranDung6129.github.io.git
   cd TranDung6129.github.io
   ```

2. **Cài đặt dependencies**
   ```bash
   bundle install
   ```

3. **Chạy development server**
   ```bash
   bundle exec jekyll serve --livereload
   ```

4. **Truy cập local site**
   - URL: `http://localhost:4000`
   - Site sẽ tự động reload khi có thay đổi

## 📝 Viết bài mới

### Tạo bài viết mới

1. **Tạo file trong `_posts/`**
   - Format tên: `YYYY-MM-DD-title-slug.md`
   - Ví dụ: `2025-01-15-quantum-mechanics-basics.md`

2. **Front matter chuẩn**
   ```yaml
   ---
   title: "Tiêu đề bài viết"
   date: 2025-01-15
   categories: [mathematics] # một trong các category đã có
   tags: [quantum, physics, theory]
   excerpt: "Mô tả ngắn gọn về bài viết"
   header:
     image: /assets/images/posts/featured-image.jpg
     teaser: /assets/images/posts/teaser-image.jpg
   toc: true
   toc_label: "Mục lục"
   toc_sticky: true
   ---
   ```

### Categories hiện có

- `mathematics` - Toán học
- `physics` - Vật lý  
- `philosophy` - Triết học
- `economics` - Kinh tế học
- `computer-science` - Khoa học máy tính
- `translations` - Dịch thuật

### Quy tắc viết

1. **Tiêu đề**: Rõ ràng, hấp dẫn, SEO-friendly
2. **Cấu trúc**: Sử dụng heading hierarchy đúng (H2, H3, H4)
3. **Nội dung**: Chuyên sâu, có tham khảo, liên kết nội bộ
4. **Hình ảnh**: Đặt trong `/assets/images/posts/`
5. **Math**: Sử dụng MathJax syntax `$$math$$`

## 🎨 Styling và assets

### Cấu trúc assets

```
assets/
├── css/
│   └── main.scss
├── images/
│   ├── posts/          # Hình ảnh bài viết
│   ├── categories/     # Hình đại diện category
│   └── site/          # Logo, favicon, etc.
├── js/
│   └── _main.js
├── documents/         # PDF, tài liệu tải về
└── downloads/         # Files khác
```

### Custom CSS

Thêm custom styles trong `assets/css/main.scss`:

```scss
---
# Front matter required
---

@import "minimal-mistakes/skins/{{ site.minimal_mistakes_skin | default: 'default' }}";
@import "minimal-mistakes";

// Custom styles here
.custom-class {
  // Your styles
}
```

## 🔧 Configuration

### _config.yml quan trọng

- **Site settings**: title, description, url
- **Author info**: bio, avatar, social links  
- **Collections**: categories configuration
- **Plugins**: Jekyll plugins
- **Theme settings**: skin, layout options

### Navigation

Cập nhật navigation trong `_data/navigation.yml`:

```yaml
main:
  - title: "Trang chủ"
    url: /
  - title: "Bài viết"
    url: /posts/
  - title: "Danh mục"
    url: /categories/
  - title: "Giới thiệu"
    url: /about/
```

## 🧪 Testing

### Local testing

```bash
# Build và serve
bundle exec jekyll serve

# Build production
bundle exec jekyll build

# Kiểm tra links
bundle exec htmlproofer ./_site --disable-external
```

### Pre-commit checklist

- [ ] Spell check nội dung
- [ ] Kiểm tra formatting Markdown
- [ ] Optimize hình ảnh
- [ ] Test responsive design
- [ ] Kiểm tra links internal/external

## 📦 Deployment

### GitHub Pages

- Auto deploy từ `main` branch
- Jekyll build tự động
- Custom domain: `trandung6129.github.io`

### Manual deploy

```bash
# Build production
JEKYLL_ENV=production bundle exec jekyll build

# Deploy to server
rsync -avz _site/ user@server:/var/www/html/
```

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **Bundle install failed**
   ```bash
   rm Gemfile.lock
   bundle install
   ```

2. **Jekyll serve error**
   ```bash
   bundle clean --force
   bundle install
   ```

3. **Theme not loading**
   - Kiểm tra `theme` trong `_config.yml`
   - Restart jekyll serve

4. **CSS not updating**
   - Clear browser cache
   - Restart with `--force_polling`

### Debug mode

```bash
bundle exec jekyll serve --verbose --trace
```

## 📚 Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Minimal Mistakes Guide](https://mmistakes.github.io/minimal-mistakes/)
- [Markdown Cheat Sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
- [MathJax Documentation](https://docs.mathjax.org/)

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Test locally
5. Submit Pull Request

---

*Happy coding! 🚀* 