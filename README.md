# coelacanth

[![Build Status](https://img.shields.io/travis/lepisma/coelacanth.svg?style=flat-square)](https://travis-ci.org/lepisma/coelacanth)
[![npm](https://img.shields.io/npm/v/coelacanth.svg?style=flat-square)](https://www.npmjs.com/package/coelacanth)
[![npm](https://img.shields.io/npm/l/coelacanth.svg?style=flat-square)](https://www.npmjs.com/package/coelacanth)
[![GitHub issues](https://img.shields.io/github/issues/lepisma/coelacanth.svg?style=flat-square)](https://github.com/lepisma/coelacanth/issues)


Derivation based config management with defaults and overrides.

#### The problem

> You want a config object with certain *defaults* and some reactive *derived*
> key-value pairs. *Overrides* to any of these values should take precedence.

```js
import Coelacanth from 'coelacanth'

const configData = {
  x: 40,
  y: 32,
  margins: {
    top: 10
  }
}

let conf = new Coelacanth(configData)
conf.x // 40

conf.margins.derive('bottom', (node, root) => node.top + root.x)
conf.margins.bottom // 50

conf = conf.overwrite({margins: {top: 30}})
conf.margins.bottom // 70
```
