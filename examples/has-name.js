'use strict';

var SyncSpec = require('./../lib/bspec').SyncSpec;
var util = require('util');

function HasNameSpec() { }
util.inherits(HasNameSpec, SyncSpec);

HasNameSpec.prototype.isSatisfiedBy = function(user) {
  return user && user.hasOwnProperty('name');
};

var user1 = { name: 'Bob' };
var user2 = { };

var spec = new HasNameSpec();

console.log(spec.isSatisfiedBy(user1)); // true
console.log(spec.isSatisfiedBy(user2)); // false
