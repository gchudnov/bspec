'use strict';

var should = require('should');
var util = require('util');
var bspec = require('./../lib/bspec');

describe('Specification from sync specifications', function() {

  //
  function BooleanSpec(value) {
    this.value = value;
  }

  util.inherits(BooleanSpec, bspec.SyncSpec);

  BooleanSpec.prototype.isSatisfiedBy = function() {
    return this.value;
  };

  //
  function ErrorSpec() {
  }

  util.inherits(ErrorSpec, bspec.SyncSpec);

  ErrorSpec.prototype.isSatisfiedBy = function() {
    throw new Error('some error');
  };

  var alwaysTrue = new BooleanSpec(true);
  var alwaysFalse = new BooleanSpec(false);
  var alwaysError = new ErrorSpec();

  var Spec = bspec.SyncSpec;

  it('can be created with `new`', function(done) {
    var spec = new Spec(alwaysTrue);
    var flag = spec.isSatisfiedBy({});
    flag.should.be.true;
    done();
  });

  it('can be created from `true`', function(done) {
    var spec = Spec(alwaysTrue);
    var flag = spec.isSatisfiedBy({});
    flag.should.be.true;
    done();
  });

  it('can be created from `false`', function(done) {
    var spec = Spec(alwaysFalse);
    var flag = spec.isSatisfiedBy({});
    flag.should.be.false;
    done();
  });

  it('can be created from `error`', function(done) {
    var spec = Spec(alwaysError);
    (function() {
      spec.isSatisfiedBy({});
    }).should.throw();
    done();
  });

  it('can be composed', function(done) {
    var spec = Spec(alwaysTrue).and(alwaysTrue).or(alwaysFalse).not();
    var flag = spec.isSatisfiedBy({});
    flag.should.be.false;
    done();
  });

});
