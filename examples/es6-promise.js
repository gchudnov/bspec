'use strict';

/**
 * Specifications based on ES6 promises (no polyfill, Promise support is needed, e.g. io.js)
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
  }).catch(function(err) {
    console.log('error:', err);
  });

executableSpec.isSatisfiedBy(operation2)
  .then(function(flag) {
    console.log('is operation2 executable: ', flag);
  }).catch(function(err) {
    console.log('error:', err);
  });

