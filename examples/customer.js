'use strict';

var bspec = require('./../lib/bspec');

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
