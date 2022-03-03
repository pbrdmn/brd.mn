---
title: Step Generator
description: Generating a sequence of numbers
date: 2018-01-19
tags: [javascript, npm]
---

# Step Generator

Using generator functions to automate producing a sequence of numbers.

Published to [NPM/step-generator](https://www.npmjs.com/package/step-generator)

## Installation

```sh
npm install --save step-generator
```

## Test

```sh
npm test
```

## Usage

Generate a sequence of stepping numbers.

```js
const stepGenerator = require('step-generator')

const evenGenerator = stepGenerator({ start: 2, step: 2 })

const evens = [
  evenGenerator.next().value,
  evenGenerator.next().value,
  evenGenerator.next().value,
  evenGenerator.next().value,
]

console.log(evens)
```

Output

```js
[2, 4, 6, 8]
```
