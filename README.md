# bspec 

[![Build Status](https://travis-ci.org/gchudnov/bspec.svg)](https://travis-ci.org/gchudnov/bspec)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/bspec.svg)](https://saucelabs.com/u/bspec)

A JavaScript library for structuring business rules.

A *specification* is a predicate that determines if an object does or does not satisfy some criteria.
Business rules can be expressed as predicates and combined using operators such as "AND", "OR" and "NOT" to
express more complex rules.


## Example

```javascript
'use strict';

var bspec = require('bspec');

/**
 * Constraint that only a customer who has specified a first given name can specify a second given name
 */
var hasFirstName = bspec.makeSync(function(customer) {
  return !!(customer && customer.first_name);
});

var hasSecondName = bspec.makeSync(function(customer) {
  return !!(customer && customer.second_name);
});

var customer1 = { first_name: 'Bob' };
var customer2 = { second_name: 'Pablo' };
var customer3 = { first_name: 'Juan', second_name: 'Pablo' };

var isCustomerNameValid = (hasSecondName.not()).or(hasFirstName);

console.log(isCustomerNameValid.isSatisfiedBy(customer1)); // true
console.log(isCustomerNameValid.isSatisfiedBy(customer2)); // false
console.log(isCustomerNameValid.isSatisfiedBy(customer3)); // true

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
