---
title: "posts"
layout: base-layout.njk
pagination:
  data: collections.post
  size: 4
  reverse: true
  alias: posts
customStyle: |
  article {
    margin-top: 3.5em;
  }
---

# Posts

{% include '_posts_list.njk' %}

{% include '_nav_arrows.njk' %}

{# vim: syntax=markdown :
#}
