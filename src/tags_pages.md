---
title: "tag listing for website"
layout: base-layout.njk
pagination:
  data: collections
  size: 1
  alias: tag
  filter:
  - "all"
  - "post"
permalink: /tags/{{ tag }}/
---

<h1>Posts tagged "{{ tag }}"</h1>

<ol>
{% set taglist = collections[ tag ] %}
{% for post in taglist  | reverse %}
  <li><a href="{{ post.url | url }}">{{ post.data.title }}</a></li>
{% endfor %}
</ol>

{# vim: syntax=markdown :
#}