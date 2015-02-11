# bspec 

[![Build Status](https://travis-ci.org/gchudnov/bspec.svg)](https://travis-ci.org/gchudnov/bspec)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/bspec.svg)](https://saucelabs.com/u/bspec)

_bspec_ is a small JavaScript library for structuring business rules.

A *specification* is a predicate that determines if an object does or does not satisfy some criteria.
Business rules can be expressed as predicates and combined using operators such as "AND", "OR" and "NOT" to
express more complex rules.


## Example

```javascript
'use strict';

var bspec = require('bspec');

/**
 * Constraint:
 * Only a customer who has specified a first given name can specify a second given name
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

// create a composite specification to verify the constraint
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

## API
Business rules can be combined by chaining the business rules together using boolean logic:

### .and(otherSpec)
the _and_ of a set of specifications is true if and only if all of its operands are true. 
```javascript
var spec = spec1.and(spec2);
```

### .or(otherSpec)
the _or_ of a set of specifications is true if and only if one or more of its operands is true
```javascript
var spec = spec1.or(spec2);
```

### .not()
_not_ negates the specification
```javascript
var spec = spec1.not();
```

### .explain()
prints the rules used for composite specification, e.g.:
```javascript
console.log(someSpec.explain());
// ((ValidOrderSpec AND (NOT OverDueOrderSpec)) AND (NOT OrderProcessed))
```

### .isSatisfiedBy(candidate) and .isSatisfiedBy(candidate, cb)
checks whether some _candidate_ object satisfies the specification.
isSatisfiedBy can be run with either a callback interface or plain interface

**Callback Interface**

```javascript
spec.isSatisfiedBy({ name: 'Alice' }, function(err, flag) {
  // `err` contains an error
  // `flag` contains true|false
});
```

**Plain Interface**

```javascript
var flag = spec.isSatisfiedBy({ name: 'Alice' });
// returns true|false
// should throw an Error exception in case of an error
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
