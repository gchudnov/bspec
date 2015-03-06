# bspec 

[![Build Status](https://travis-ci.org/gchudnov/bspec.svg)](https://travis-ci.org/gchudnov/bspec) [![Coverage Status](https://coveralls.io/repos/gchudnov/bspec/badge.svg)](https://coveralls.io/r/gchudnov/bspec)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/bspec.svg)](https://saucelabs.com/u/bspec)

> A JavaScript library for structuring business rules.

## Example

Consider the following Metro scenario.

An entry barrier opens only if the ticket meets all of the following criteria:

1. it is valid for travel from that station;
2. it has not expired;
3. it has not already been used for the maximum number of journeys allowed.

```javascript
'use strict';

// use promise-based specifications
var Spec = require('bspec').PromiseSpec;

// hardcore the `today` date for the sake of consistent results
var TODAY = new Date(2015, 2, 1);

// Is the ticket expired?
var isTicketExpired = function isTicketExpired(ticket) {
  return Promise.resolve(TODAY > ticket.expiresAt);
};

// Is the ticket has been used for the maximum number of journeys allowed?
var isMaxJourneys = function isMaxJourneys(ticket) {
  return Promise.resolve(ticket.cur_journeys >= ticket.max_journeys);
};

// it the ticket valid for travel from `name` station
var isValidFromStation = function isValidFromStation(name, ticket) {
  return Promise.resolve(ticket.stations.indexOf(name) !== -1);
};

// Rule implementation for the `Riva` station
var barrierSpec = Spec(isValidFromStation.bind(null, 'Riva'))
                        .and(Spec(isTicketExpired).not())
                        .and(Spec(isMaxJourneys).not());

// Some ticket we would like to check against the given rules
var ticket = {
  stations: [ 'Riva' ],
  expiresAt: new Date(2015, 2, 6),
  max_journeys: 30,
  cur_journeys: 11
};

// check that the ticket satisfies the composite specification
barrierSpec.isSatisfiedBy(ticket)
  .then(function(result) {
    console.log('Is the ticket can be used to enter the Riva station:', result);
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

To use _bspec_ in a browser, use the `bspec.js` file in the `/dist` directory of this repository, or build it manually. To build a fresh version:

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
Predicate should be a function that returns a boolean value or a value that can be checked for truthfulness.

Specifications can be combined using `.and()`, `.or()` and `.not()` methods in a composite specification to express more complex rules.

The library supports the following specifications:
* Synchronous -- `SyncSpec`
* Callback-based -- `CallbackSpec`
* Promise-based -- `PromiseSpec`

A specification must implement the `isSatisfiedBy` method. The method is used to check whether an object does  satisfy some criteria. Its [signature](#issatisfiedby) depends on the type of specification.

To create a specification you can:
* Create an instance of `Spec` object and implement `isSatisfiedBy` predicate-function.
* Create an plain object with the `isSatisfiedBy` property that is a predicate-function and wrap it in a `Spec` object.
* Wrap a predicate-function in a `Spec` object

## API

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
NOTE: a meaningful names will be printed only if specification is an instance of `Spec` objects.

### .isSatisfiedBy(...)
checks whether some _candidate_ object satisfies the specification.
_isSatisfiedBy_ method signature depends on the specification type:

#### SyncSpec (synchronous specification)
```javascript
  // signature:
  function isSatisfiedBy(candidate: any): boolean;
  
  // usage:
  var result = spec.isSatisfiedBy(obj);
  
  // `result` true|false value
  // is something wrong, should throw an exception
```

#### CallbackSpec (callback-based specification)
```javascript
  // signature:
  function isSatisfiedBy(candidate: any, cb: (err: Error, result: boolean): void): void;
  
  // usage:
  spec.isSatisfiedBy(obj, function(err, result) {
    // `err` contains an error if any
    // `result` true|false value
  });
```

#### PromiseSpec (promise-based specification)
```javascript
  // signature:
  function isSatisfiedBy(candidate: any): Promise;

  // usage:
  spec.isSatisfiedBy(obj)
    .then(function(result) {
      // `result` true|false value
    }).catch(function(err) {
      // `err` contains an error if any
    });
```
NOTE: To use [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)-based specifications you need ES6 Promise to be implemented in your environment: `io.js`, modern browser or a  polyfill, e.g. [es6-promise](https://github.com/jakearchibald/es6-promise).

For details of usage, take a look at the [examples](/examples) directory in the project tree.

## Tests

To run the tests for _bspec_:
```bash
$ npm test
```

## Contact

[Grigoriy Chudnov] (mailto:g.chudnov@gmail.com)


## License

Distributed under the [The MIT License (MIT)](https://github.com/gchudnov/bspec/blob/master/LICENSE).
