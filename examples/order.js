'use strict';

var SyncSpec = require('./../lib/bspec').SyncSpec;
var util = require('util');

// can be implemented with bspec- factory functions

// is expired
function OrderExpiredSpec() { }

util.inherits(OrderExpiredSpec, SyncSpec);

OrderExpiredSpec.prototype.isSatisfiedBy = function isSatisfiedBy(order) {
  return (Date.now() > order.date);
};

// is valid
function OrderValidSpec() { }

util.inherits(OrderValidSpec, SyncSpec);

OrderValidSpec.prototype.isSatisfiedBy = function isSatisfiedBy(order) {
  return order && order.hasOwnProperty('number') && order.hasOwnProperty('date');
};

// is processed
var processed = {};

function OrderProcessed() { }

util.inherits(OrderProcessed, SyncSpec);

OrderProcessed.prototype.isSatisfiedBy = function isSatisfiedBy(order) {
  return !!processed[order.number];
};


var isExpired = new OrderExpiredSpec();
var isValid = new OrderValidSpec();
var isProcessed = new OrderProcessed();

var spec = isValid.and(isExpired.not()).and(isProcessed.not());

var order = { number: 'Z10',  date: new Date('2014-05-06') };

console.log('check that the order is `valid`, `not expired` and `not processed`:');

if(spec.isSatisfiedBy(order)) {
  console.log(' - true');
} else {
  console.log(' - false');
}

// inspect composite specification
console.log('explain composite rule:', spec.explain()); // ((ValidOrderSpec AND (NOT OverDueOrderSpec)) AND (NOT OrderProcessed))
