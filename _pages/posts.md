---
title: "Posts"
permalink: /posts/
layout: archive
author_profile: true
sidebar:
  nav: "sidebar-nav"
---

<div class="entries-list">
{% for post in site.posts %}
  {% include archive-single.html %}
{% endfor %}
</div>
