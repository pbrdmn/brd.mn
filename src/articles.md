---
layout: articles.njk
title: Articles
---
# Articles

{% for article in collections.articles reversed %}
- {{article.date | date: "%Y-%m-%d" }} &rArr; [{{article.data.title}}]({{article.url}})

      {{article.data.description}}
{% else %}
  There are no articles available.
{%- endfor %}