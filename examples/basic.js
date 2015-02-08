'use strict';

var SyncSpec = require('./../lib/bspec').SyncSpec;

function HasNameSpec() {
}

HasNameSpec.prototype = Object.create(SyncSpec);


HasNameSpec.prototype.isSatisfiedBy = function(user) {
  return user && user.hasOwnProperty('name');
};

var user1 = { name: 'Bob' };
var user2 = { };

var spec = new HasNameSpec();

console.log(spec.isSatisfiedBy(user1)); // true
console.log(spec.isSatisfiedBy(user2)); // false
