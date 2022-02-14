---
title: "Home page"
layout: base-layout.njk
pagination:
  data: collections.post
  size: 10
  reverse: true
  alias: posts
customStyle: |
  .post-item {
    margin-top: 2.5em;
  }
---

# Welcome to the blog, World { #welcome }

A blog.

## Posts

{%- from 'postslist_macro.njk' import postlist_macro -%}

{{ postlist_macro(posts, 'h3') }}

{% include '_nav_arrows.njk' %}

{# vim: syntax=markdown :
#}
