# ![bspec logo](http://i.imgur.com/5zhNRSp.png)

[![Build Status](https://travis-ci.org/gchudnov/bspec.svg)](https://travis-ci.org/gchudnov/bspec) [![Coverage Status](https://coveralls.io/repos/gchudnov/bspec/badge.svg)](https://coveralls.io/r/gchudnov/bspec)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/bspec.svg)](https://saucelabs.com/u/bspec)

> A JavaScript library for structuring business rules.

## Overview

[Structuring and validating business rules in JavaScript](https://medium.com/@gchudnov/structuring-and-validating-business-rules-in-javascript-fbaa1019902a)

## Example

Consider the following scenario:

On entering a train station, passengers are required to insert a ticket into a slot beside a closed barrier. An entry barrier opens only if the ticket meets all of the following criteria:

1. it is valid for travel from that station;
2. it has not expired;
3. it has not already been used for the maximum number of journeys allowed.

```javascript
'use strict';

// use promise-based specifications
var Spec = require('bspec').PromiseSpec;

// hardcode the `today` date for the sake of consistent results
var TODAY = new Date(2015, 2, 1);

// Is the ticket expired?
var isTicketExpired = function isTicketExpired(ticket) {
  return Promise.resolve(TODAY > ticket.expires_at);
};

// Is the ticket has been used for the maximum number of journeys allowed?
var isMaxJourneys = function isMaxJourneys(ticket) {
  return Promise.resolve(ticket.cur_journeys >= ticket.max_journeys);
};

// Is the ticket valid for travel from `name` station?
var isValidFromStation = function isValidFromStation(name, ticket) {
  return Promise.resolve(ticket.stations.indexOf(name) !== -1);
};

// Rule implementation for the `Riva` station barrier
var barrierSpec = Spec(isValidFromStation.bind(null, 'Riva'))
                        .and(Spec(isTicketExpired).not())
                        .and(Spec(isMaxJourneys).not());

// A ticket we would like to check
var ticket = {
  stations: [ 'Riva' ],
  expires_at: new Date(2015, 2, 6),
  max_journeys: 30,
  cur_journeys: 11
};

// Verify the ticket satisfies the created specification
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
The essential part of the library is a *specification* -- an object with the following properties:
* it can be combined with other *specification*-objects using `.and()`, `.or()` and `.not()` methods to form a composite specification and express more complex rules.
* it implements `isSatisfiedBy` method -- a predicate that determines whether a *candidate* object does or does not satisfy some criteria.

The library supports the following specifications:
* Synchronous -- `SyncSpec`
* Callback-based -- `CallbackSpec`
* Promise-based -- `PromiseSpec`

```javascript
  var Spec = require('bspec').SyncSpec;
```
```javascript
  var Spec = require('bspec').CallbackSpec;
```
```javascript
  var Spec = require('bspec').PromiseSpec;
```

To create a composable *specification*, make an instance of `Spec` and define the `isSatisfiedBy` method to check for some condition. `isSatisfiedBy` method [signature](#issatisfiedby) depends on the type of specification (see the [API](#api) section below).

There are several ways you can define the `isSatisfiedBy` method:
* Write a predicate-function and wrap it in a `Spec` object;
* Create an object with the `isSatisfiedBy` property and wrap it in a `Spec` object;
* Derive a new object from `Spec` and implement the `isSatisfiedBy` function.

#### Writing a predicate-function and wrapping it in a `Spec` object
```javascript
var Spec = require('bspec').SyncSpec;

function isExpired(order) {
  return (new Date() > order.date);
}

var expiredSpec = new Spec(isExpired);
console.log(expiredSpec.isSatisfiedBy({ date: new Date(2015, 1, 5) }));
```

#### Creating an object with the `isSatisfiedBy` property and wrapping it in a `Spec`
```javascript
var Spec = require('bspec').SyncSpec;

var isExpired = {
  isSatisfiedBy: function(order) {
    return (new Date() > order.date);
  }
};

var expiredSpec = new Spec(isExpired);
console.log(expiredSpec.isSatisfiedBy({ date: new Date(2015, 1, 5) }));
```

#### Deriving a new object from `Spec` and implementing the `isSatisfiedBy` function
```javascript
var Spec = require('bspec').SyncSpec;
var util = require('util');

function IsExpiredSpec() { }

util.inherits(IsExpiredSpec, Spec);

IsExpiredSpec.prototype.isSatisfiedBy = function isSatisfiedBy(order) {
  return (new Date() > order.date);
};

var expiredSpec = new IsExpiredSpec();
console.log(expiredSpec.isSatisfiedBy({ date: new Date(2015, 1, 5) }));
```

OR with **ES6 classes**:
```javascript
var Spec = require('bspec').SyncSpec;

class IsExpiredSpec extends Spec {
  isSatisfiedBy(order) {
    return (new Date() > order.date);
  }
}

var expiredSpec = new IsExpiredSpec();
console.log(expiredSpec.isSatisfiedBy({ date: new Date(2015, 1, 5) }));
```

## API

### .and(otherSpec)
the _and_ of a set of specifications is *true* if and only if all of its operands are *true*. 
```javascript
var spec = spec1.and(spec2);
```

### .or(otherSpec)
the _or_ of a set of specifications is *true* if and only if one or more of its operands is *true*
```javascript
var spec = spec1.or(spec2);
```

### .not()
_not_ negates the specification
```javascript
var spec = spec1.not();
```

### .explain()
returns a string that describes a composite specification
```javascript
console.log(someSpec.explain());
// ((ValidOrderSpec AND (NOT OverDueOrderSpec)) AND (NOT OrderProcessed))
```
**NOTE:** meaningful names will be printed only for specifications derived from a `Spec` object.

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
  // should throw an exception in case of an error
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
**NOTE:** To use [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)-based specifications you need ES6 Promise to be implemented in your environment, e.g. `io.js`, a modern browser or a polyfill like [es6-promise](https://github.com/jakearchibald/es6-promise).

For the details of usage, take a look at the [examples](/examples) section in the project.

## Tests

To run the tests for _bspec_:
```bash
$ npm test
```

## Contact

[Grigoriy Chudnov] (mailto:g.chudnov@gmail.com)


## License

Distributed under the [The MIT License (MIT)](https://github.com/gchudnov/bspec/blob/master/LICENSE).
