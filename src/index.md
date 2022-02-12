---
title: "my blog"
layout: base-layout.njk
pagination:
  data: collections.post
  size: 10
  reverse: true
  alias: posts
---

# Welcome to the blog, World { #welcome }

<!--
layout: layouts/default
-->

## Posts

{% for post in posts %}
  <article>
    <h2>
      <a href="{{ post.url | url }}">{{ post.data.title }}</a>
    </h2>
    <time datetime="{{ post.date | dateIso }}">{{ post.date | dateReadable }}</time>
    <br>
    <div style="border: solid 2pt green;"> excerpt: {% excerpt post %}</div>
  </article>
{% endfor %}

<!--
vim: syntax=markdown :
-->
