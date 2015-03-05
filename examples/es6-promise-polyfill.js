'use strict';

require('es6-promise').polyfill();

/**
 * Specifications based on ES6 promises (with a polyfill)
 */

var Spec = require('./../lib/bspec').PromiseSpec;

function isRunning(operation) {
  return Promise.resolve(operation.status === 'running');
}

function isPending(operation) {
  return Promise.resolve(operation.status === 'pending');
}

var executableSpec = Spec(isRunning).or(isPending);

var operation1 = { status: 'running' };
var operation2 = { status: 'stopped' };

executableSpec.isSatisfiedBy(operation1)
  .then(function(flag) {
    console.log('is operation1 executable: ', flag);
  });

executableSpec.isSatisfiedBy(operation2)
  .then(function(flag) {
    console.log('is operation2 executable: ', flag);
  });

