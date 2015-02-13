'use strict';

var should = require('should');
var util = require('util');
var bspec = require('./../lib/bspec');

var CallbackSpec = bspec.CallbackSpec;


describe('Composite Specification', function() {

  // TRUE
  function TrueSpec() {
  }

  util.inherits(TrueSpec, CallbackSpec);

  TrueSpec.prototype.isSatisfiedBy = function(dummy, cb) {
    return cb(null, true);
  };

  // FALSE
  function FalseSpec() {
  }

  util.inherits(FalseSpec, CallbackSpec);

  FalseSpec.prototype.isSatisfiedBy = function(dummy, cb) {
    return cb(null, false);
  };

  var alwaysTrue = new TrueSpec();
  var alwaysFalse = new FalseSpec();


  it('can be validated for an expression', function(done) {
    alwaysTrue.and(alwaysFalse).or(alwaysTrue).isSatisfiedBy({}, function(err, flag) {
      should.not.exist(err);
      flag.should.be.true;
      done();
    });
  });

});
