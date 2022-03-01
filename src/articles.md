---
layout: articles.njk
title: Articles
tags: nav
---
## Articles

{% for article in collections.articles reversed %}
> ### [{{article.data.title}}]({{article.url}})
>
> {{article.data.description}}
> 
> <span class="meta">Posted on {{article.date | date: "%Y-%m-%d" }}</span>
{% else %}
  There are no articles available.
{%- endfor %}