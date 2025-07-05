---
title: "Ghi chú"
permalink: /notes/
layout: single-with-left-panel
author_profile: true
---

Đây là nơi tôi lưu giữ những ghi chú ngắn, những ý tưởng bất chợt hoặc các bản nháp chưa hoàn chỉnh. Chúng có thể không được trau chuốt như các bài viết chính thức, nhưng là một phần quan trọng trong quá trình tư duy và nghiên cứu.

<hr>

{% for post in site.categories.notes %}
  {% include archive-single.html type="list" %}
{% endfor %} 