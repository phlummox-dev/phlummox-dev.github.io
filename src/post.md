---
title: "posts"
layout: base-layout.njk
pagination:
  data: collections.post
  size: 2
  reverse: true
  alias: posts
---

## Posts

<!--
layout: layouts/default
-->


{% for post in posts %}
<article>
  <h3>
    <a href="{{ post.url | url }}">{{ post.data.title | safe }}</a>
  </h3>
  <span style="font-weight: bold;" >
    <time datetime="{{ post.date | dateIso }}">{{ post.date | dateReadable }}</time>
  </span>

  {% for keyword in (post.data.tags | only_normal_tags)  %}<a href={{ ("/tags/" + keyword) | url }}><kbd class="item-tag">{{ keyword }}</kbd></a> {% endfor %}

  <div style="border: solid 2pt green; word-break: break-word;"> excerpt: {% excerpt post %}</div>
</article>
{% endfor %}

<div class="pages">
{% if pagination.href.previous != null -%}
  <a class="icon pages-icon" href="{{ pagination.href.previous | url }}" rel="prev" aria-label="previous page" >
      <i class="fa fa-arrow-left"></i>
  </a>
{%- endif %}
{% if pagination.href.next != null -%}
  <a class="icon pages-icon" href="{{ pagination.href.next | url }}" rel="next" aria-label="next page" >
      <i class="fa fa-arrow-right"></i>
  </a>
{%- endif %}
</div>

{# vim: syntax=markdown :
#}
