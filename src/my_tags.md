---
title: "my tags"
layout: base-layout.njk
---

# Tags

<!--
layout: layouts/default
-->

{% for tag, postlist in (collections | dictsort) %}
{% if (tag != "post") and (tag != "all") %}
<a href="{{ ("/tags/" + tag) | url }}">{{ tag }}</a><br>
{% endif %}
{% endfor %}


<!--
vim: syntax=markdown :
-->
