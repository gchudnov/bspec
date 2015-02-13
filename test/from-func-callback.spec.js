'use strict';

var should = require('should');
var util = require('util');
var bspec = require('./../lib/bspec');

describe('Specification from functions with a callback interface', function() {

  function alwaysTrue(obj, cb) { cb(null, true); }
  function alwaysFalse(obj, cb) { cb(null, false); }
  function alwaysError(obj, cb) { cb(new Error('some error')); }

  var Spec = bspec.CallbackSpec;

  it('can be created with `new`', function(done) {
    var spec = new Spec(alwaysTrue);
    spec.isSatisfiedBy({}, function(err, flag) {
      should.not.exist(err);
      flag.should.be.true;
      done();
    });
  });

  it('can be created from `true`', function(done) {
    var spec = Spec(alwaysTrue);
    spec.isSatisfiedBy({}, function(err, flag) {
      should.not.exist(err);
      flag.should.be.true;
      done();
    });
  });

  it('can be created from `false`', function(done) {
    var spec = Spec(alwaysFalse);
    spec.isSatisfiedBy({}, function(err, flag) {
      should.not.exist(err);
      flag.should.be.false;
      done();
    });
  });

  it('can be created from `error`', function(done) {
    var spec = Spec(alwaysError);
    spec.isSatisfiedBy({}, function(err) {
      should.exist(err);
      done();
    });
  });

  it('can be composed', function(done) {
    var spec = Spec(alwaysTrue).and(alwaysTrue).or(alwaysFalse).not();
    spec.isSatisfiedBy({}, function(err, flag) {
      should.not.exist(err);
      flag.should.be.false;
      done();
    });
  });

});
