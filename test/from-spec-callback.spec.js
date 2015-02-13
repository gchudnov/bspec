'use strict';

var should = require('should');
var util = require('util');
var bspec = require('./../lib/bspec');

describe('Specification from specifications with callback interface', function() {

  //
  function BooleanSpec(value) {
    this.value = value;
  }

  util.inherits(BooleanSpec, bspec.CallbackSpec);

  BooleanSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate, cb) {
    return cb(null, this.value);
  };

  //
  function ErrorSpec() {
  }

  ErrorSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate, cb) {
    cb(new Error('some error'));
  };

  util.inherits(ErrorSpec, bspec.CallbackSpec);

  var alwaysTrue = new BooleanSpec(true);
  var alwaysFalse = new BooleanSpec(false);
  var alwaysError = new ErrorSpec();

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
