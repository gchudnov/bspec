'use strict';

var Spec = require('./../lib/bspec').CallbackSpec;

function isRunning(candidate, cb) {
  cb(null, candidate.status === 'running');
}

function isPending(candidate, cb) {
  cb(null, candidate.status === 'pedning');
}

var executableSpec = Spec(isRunning).or(isPending);

var operation = { status: 'running' };

executableSpec.isSatisfiedBy(operation, function(err, flag) {
  if(err) {
    throw err;
  }

  console.log('is operation executable: ', flag);
});
