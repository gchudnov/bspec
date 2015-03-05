'use strict';

var bspec = require('./../lib/bspec');

/**
 * Constraint that only a customer who has specified a first given name can specify a second given name
 */
var hasFirstName = bspec.SyncSpec(function(customer) {
  return !!(customer && customer.first_name);
});

var hasSecondName = bspec.SyncSpec(function(customer) {
  return !!(customer && customer.second_name);
});

var customer1 = { first_name: 'Bob' };
var customer2 = { second_name: 'Pablo' };
var customer3 = { first_name: 'Juan', second_name: 'Pablo' };

var isCustomerNameValid = (hasSecondName.not()).or(hasFirstName);

console.log('Only a customer who has specified a first given name can specify a second given name:');
console.log('customer1 (first_name: `Bob`): ', isCustomerNameValid.isSatisfiedBy(customer1)); // true
console.log('customer2 (second_name: `Pablo`): ', isCustomerNameValid.isSatisfiedBy(customer2)); // false
console.log('customer3 (first_name: `Juan`, second_name: `Pablo`): ', isCustomerNameValid.isSatisfiedBy(customer3)); // true
