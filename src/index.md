---
title: "Home page"
layout: base-layout.njk
pagination:
  data: collections.post
  size: 10
  reverse: true
  alias: posts
customStyle: |
  article {
    margin-top: 3.5em;
  }
---

# Welcome to the blog, World { #welcome }

A blog.

## Posts

{% include '_posts_list.njk' %}

{% include '_nav_arrows.njk' %}


{# vim: syntax=markdown :
#}
