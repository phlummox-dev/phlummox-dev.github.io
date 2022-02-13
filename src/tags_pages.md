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
customStyle: |
  article {
    margin-top: 3.5em;
---

<h1>Posts tagged "{{ tag }}"</h1>

{% set posts = collections[ tag ] | reverse %}

{#
{% for post in posts  %}

<a href="{{ post.url | url }}">{{ post.data.title }}</a>

{% endfor %}
#}

{% include '_posts_list.njk' %}


{# vim: syntax=markdown :
#}
