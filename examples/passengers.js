'use strict';

var bspec = require('./../lib/bspec');

/**
 * A method to ensure that the number of passengers specified in a flight booking request is eight or less
 */
var passengersPerRequest = bspec.SyncSpec(function(req) {
  return req && req.passenger_count <= 8;
});

var req1 = { }; // invalid request
var req2 = { passenger_count: 12 };
var req3 = { passenger_count: 6 };

console.log('Ensure that the number of passengers specified in a flight booking request is eight or less:');

console.log('1st request (invalid):', passengersPerRequest.isSatisfiedBy(req1)); // false
console.log('2nd request (12 passengers within):', passengersPerRequest.isSatisfiedBy(req2)); // false
console.log('3rd request (6 passengers):', passengersPerRequest.isSatisfiedBy(req3)); // true
