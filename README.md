# bspec [![Build Status](https://travis-ci.org/gchudnov/bspec.svg)](https://travis-ci.org/gchudnov/bspec) 
A JavaScript library for structuring business rules

[![Sauce Test Status](https://saucelabs.com/browser-matrix/bspec.svg)](https://saucelabs.com/u/bspec)

## Example

```javascript
'use strict';

var SyncSpec = require('bspec').SyncSpec;

function HasNameSpec() {
}

HasNameSpec.prototype = Object.create(SyncSpec);


HasNameSpec.prototype.isSatisfiedBy = function(user) {
  return user && user.hasOwnProperty('name');
};

var user1 = { name: 'Bob' };
var user2 = { };

var spec = new HasNameSpec();

console.log(spec.isSatisfiedBy(user1)); // true
console.log(spec.isSatisfiedBy(user2)); // false

```

## node.js | io.js

installing with npm:
```bash
$ npm install bspec --save
```

## In browser

To use _bspec_ in browser, use the `bspec.js` file in the `/dist` directory of this repository, or build it manually. To build a fresh version:

```bash
$ npm install
$ gulp script
```

installing with bower:
```bash
$ bower install bspec
```

## Tests

To run the tests for _bspec_:
```bash
$ npm test
```

## Contact

[Grigoriy Chudnov] (mailto:g.chudnov@gmail.com)


## License

Distributed under the [The MIT License (MIT)](https://github.com/gchudnov/bspec/blob/master/LICENSE).
