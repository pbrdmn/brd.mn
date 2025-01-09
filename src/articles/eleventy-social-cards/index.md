---
title: Eleventy social sharing cards
description: Adding meta tags to eleventy theme to provide open graph social sharing cards functionality
image: social-card.jpg
thumb: thumb.jpg
imageAlt: Rich content previewing with open graph tags
date: 2022-03-23
updated: 2023-03-10
tags:
  - eleventy
  - html
  - meta
  - social
  - programming
  - code
---

> Update: I've discovered that while technically supported, in practice using `.webp` images are often not supported across many sites. For best compatibility, use `.png` or `.jpg` images with open graph.

One of the things I wanted to add when rebuilding this site was rich content sharing, primarily for twitter.
It turns out this is relatively simple, especially when you consider setting up the article metadata in the markdown front matter of each article/page as eleventy makes this information globally available to the template engine.

The standard set of meta tags for the [open graph protocol](https://ogp.me/) include `title`, `description` and `image`, which we'll look at setting up in our template below.

## Title and Description

Using the standard front matter configuration for `title` and `description` are straight forward to add to a template by adding `<meta>` tags for `og:title` and `og:description`.

```html
<meta property="og:title" content="{{'{{'}} title }}" />
<meta property="og:description" content="{{'{{'}} description }}" />
```

## URL

An open graph URL should be a fully qualified canonical url, such as `https://brd.mn/articles/eleventy-social-cards/`. For eleventy to have access to full path to the site at build time we will need to have a way to store this configuration information. Eleventy has a built in method for setting up data to be used in situations just like this with files in the `_data` directory, called [Global Data Files](https://www.11ty.dev/docs/data-global/). I have created a `site.json` file in the `_data` directory with the following contents.

```json
{
  "name": "brd.mn",
  "subtitle": "Interested in how things work; breaking things and fixing things",
  "url": "https://brd.mn"
}
```

After adding this `_data/site.json` file, we can now access the properties in our template using the `site` variable, such as `{{'{{'}} site.url }}`. Combining this global site url with the page url will generate a fully qualified URI suitable for open graph `url` tag.

```html
<meta property="og:url" content="{{'{{'}} site.url }}{{'{{'}} page.url }}" />
```

## Image

The last, and most visually engaging, part of the open graph specification is the image. The `image` meta tag also requires a fully qualified URI similar to the `url` but depending on how images are managed with your site may require a different approach than I have here. For example, in my site I keep images in the same directory as an article's markdown file and reference the image in the article front matter with only the filename.

```markdown
---
title: Eleventy social sharing cards
image: social-card.png
...

---
```

By appending this `image` property to the same pattern used for `url`, we can add the meta tag to our template.

```html
<meta
  property="og:image"
  content="{{'{{'}} site.url }}{{'{{'}} page.url }}{{'{{'}} image }}"
/>
```

## Complete social sharing cards example

For a full open graph implementation, we add each of the above meta tags to our template, along with some additional information as suits your particular needs. In the example below, I have added a generic fallback image to display if a particular page does not have an image set as well as adding `site_name`, `creator` and `card` type meta tags.

```html
<meta property="og:title" content="{{'{{'}} title }}" />
<meta property="og:description" content="{{'{{'}} description }}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="{{'{{'}} site.url }}{{'{{'}} page.url }}" />
{%- if image %}
<meta
  property="og:image"
  content="{{'{{'}} site.url }}{{'{{'}} page.url }}{{'{{'}} image }}"
/>
{%- else %}
<meta property="og:image" content="{{'{{'}} site.url }}/images/logo.png" />
{%- endif %}
<meta property="og:site_name" content="{{'{{'}} site.name }}" />
```
