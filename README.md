# Casting

[![Build Status](https://travis-ci.org/codemix/casting.svg?branch=master)](https://travis-ci.org/codemix/casting)

Tiny type casting library for node.js and the browser.

# Installation

Via [npm](https://npmjs.org/package/casting):

    npm install --save casting


or [bower](http://bower.io/search/?q=casting):


    bower install --save casting


# Usage

```js
var casting = require('casting');

casting.cast(Array, 123); // [123]
casting.cast(String, 123); // '123'
casting.cast(Date, '2014-01-01'); // [object Date]

function MyType (value) {
  this.name = value.name;
  this.isActive = value.isActive;
}

casting.define('mytype', MyType);

casting.cast('mytype', {name: 'name', isActive: true}); // [object MyType]

var castAll = casting.forDescriptors({
  name: {
    type: 'string'
  },
  isActive: {
    type: Boolean
  }
});

var user = {name: 123, isActive: 0};

console.log(castAll(user)); // {name: '123', isActive: false}


```


# Running the tests

First, `npm install`, then `npm test`. Code coverage generated with `npm run coverage`.


# License

MIT, see [LICENSE.md](LICENSE.md).

