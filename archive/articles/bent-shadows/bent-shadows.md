---
title: CSS Bent Shadows
description: Add a bent shadow to an element to give the impression of curled corners.
date: 2016-02-23
path: /articles/bent-shadows
---

To add a bent shadow to an element to give the impression of curled corners with CSS.

Give the target block element a suitable class, e.g. `shadow`.

Add the following CSS to apply shadow to the target using the `::before` and `::after` psudo elements.

	.shadow::before,
	.shadow::after {
		content: '';
		position: absolute;
		z-index: -1;
		top: 90%;
		left: 5%;
		right: 50%;
		bottom: 0;
		box-shadow: 0 .5em 1.1em black;
		transform: skewY(-5deg);
		transform-origin: left;
	}
	.shadow::after {
		left: 50%;
		right: 5%;
		transform: skewY(5deg);
		transform-origin: right;
	}

