# bspec 

[![Build Status](https://travis-ci.org/gchudnov/bspec.svg)](https://travis-ci.org/gchudnov/bspec) [![Coverage Status](https://coveralls.io/repos/gchudnov/bspec/badge.svg)](https://coveralls.io/r/gchudnov/bspec)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/bspec.svg)](https://saucelabs.com/u/bspec)

_bspec_ is a tiny JavaScript library for structuring business rules.

## Example
Metro
An entry barrier opens only if the ticket meets all of the following criteria:
1. it is valid for travel from that station;
2. it has not expired;
3. it has not already been used for the maximum number of journeys allowed.

```javascript
'use strict';

require('es6-promise').polyfill(); // comment this if Promises are supported by your environment in io.js

var Spec = require('./../lib/bspec').PromiseSpec;

var TODAY = new Date(2015, 2, 1);

var isTicketExpired = function isTicketExpired(ticket) {
  return Promise.resolve(TODAY > ticket.expiresAt);
};

var isMaxJourneys = function isMaxJourneys(ticket) {
  return Promise.resolve(ticket.cur_journeys >= ticket.max_journeys);
};

var isValidFromStation = function isValidFromStation(name, ticket) {
  return Promise.resolve(ticket.stations.indexOf(name) !== -1);
};

//
var lowangenBarrier =
  Spec(isValidFromStation.bind(null, 'Lowangen'))
    .and(Spec(isTicketExpired).not())
    .and(Spec(isMaxJourneys).not());

var ticket = {
  stations: [ 'Lowangen' ],
  expiresAt: new Date(2015, 2, 6),
  max_journeys: 30,
  cur_journeys: 11
};

lowangenBarrier.isSatisfiedBy(ticket).then(function(result) {
    console.log('The ticket can be used to enter the Lowangen station:', result);
  })
  .catch(function(err) {
    throw err;
  });
```

## Installation

installing with npm:
```bash
$ npm install bspec --save
```

## In browser

To use _bspec_ in browser, use the `bspec.js` file in the `/dist` directory of this repository, or build it manually. To build a fresh version:

```bash
$ npm install
$ npm run browser
```

installing with bower:
```bash
$ bower install bspec
```

## Usage
To use the library you should define a *specification* -- a predicate that determines whether an object does or does not satisfy some criteria.
Predicate should be a function that returns a boolean value or a value that is can be checked for truthfulness.

A predicate can be:
* A function
* An object that has a `isSatisfiedBy` function in a property
* An instance of Spec-objects.

Predicates and combined using operators such as "AND", "OR" and "NOT" to express more complex rules.
To form a specification chain, wrap it with Spec(), e.g.:


## API

Depending on usage, there are 3 types of specifications:
* Synchronous -- `SyncSpec`
* Callback-style -- `CallbackSpec`
* Promise-based -- `PromiseSpec`

A predicate should implement one of these interfaces.


All specifications can be combined using `.and()`, `.or()` and `.not()` methods

To start the specification chain, wrap the predicate in Spec object:
```javascript
var spec = new Spec();
```


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
prints the rules used to form a composite specification, e.g.:
```javascript
console.log(someSpec.explain());
// ((ValidOrderSpec AND (NOT OverDueOrderSpec)) AND (NOT OrderProcessed))
```
NOTE: a meaningful names will be printed only if specification is an instance of (Sync|Callback|Promise)Spec objects.

### .isSatisfiedBy(...)
checks whether some _candidate_ object satisfies the specification.
_isSatisfiedBy_ method signature depends on the specification type:

* synchronous specification, SyncSpec
```javascript
  function isSatisfiedBy(candidate: any): boolean;
```
e.g.
```javascript
var result = spec.isSatisfiedBy(obj); // result is a boolean value
```


* callback-based specification, CallbackSpec
```javascript
  function isSatisfiedBy(candidate: any, cb: (err: Error, result: boolean): void): void;
```
e.g.
```javascript
  spec.isSatisfiedBy(obj, function(err, result) {
    // `err` contains an error if any
    // `result` true|false value
  });
```

* promise-based specification, PromiseSpec
```javascript
  function isSatisfiedBy(candidate: any): Promise;
```

e.g.:
```javascript
  spec.isSatisfiedBy(obj).then(function(result) { /* true|false */ }).catch(function(err) { /* error, if any */ });
```
NOTE: To use [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)-based specifications you need `io.js` or the library like `es6-promise` to polyfill the Promise.


## Tests

To run the tests for _bspec_:
```bash
$ npm test
```

## Contact

[Grigoriy Chudnov] (mailto:g.chudnov@gmail.com)


## License

Distributed under the [The MIT License (MIT)](https://github.com/gchudnov/bspec/blob/master/LICENSE).
