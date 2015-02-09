'use strict';

var bspec = require('./../lib/bspec');

/**
 * Ensure that the number of passengers specified in a flight booking request is eight or less
 */
var passengersPerRequest = bspec.makeSync(function(req) {
  return req && req.passenger_count <= 8;
});

var req1 = { }; // invalid request
var req2 = { passenger_count: 12 };
var req3 = { passenger_count: 6 };

console.log(passengersPerRequest.isSatisfiedBy(req1)); // false
console.log(passengersPerRequest.isSatisfiedBy(req2)); // false
console.log(passengersPerRequest.isSatisfiedBy(req3)); // true
