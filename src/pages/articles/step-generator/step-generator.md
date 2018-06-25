---
title: Step Generator
description: Generate a sequence of numbers
date: 2018-01-19
path: /articles/step-generator
---

Using generator functions to automate producing a sequence of numbers.

Published to [NPM/step-generator](https://www.npmjs.com/package/step-generator)

## Installation

```
npm install --save step-generator
```

## Test

```
npm test
```

## Usage

Generate a sequence of stepping numbers.

```
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

```
[2, 4, 6, 8]
```
