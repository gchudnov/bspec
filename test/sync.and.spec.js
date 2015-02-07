'use strict';

var should = require('should');
var util = require('util');
var SyncSpec = require('./../lib/bspec').SyncSpec;

describe('Sync', function() {

  describe('AND Specification', function() {

    // TRUE
    function TrueSpec() {
    }

    util.inherits(TrueSpec, SyncSpec);

    TrueSpec.prototype.isSatisfiedBy = function() {
      return true;
    };

    // FALSE
    function FalseSpec() {
    }

    util.inherits(FalseSpec, SyncSpec);

    FalseSpec.prototype.isSatisfiedBy = function() {
      return false;
    };

    var alwaysTrue = new TrueSpec();
    var alwaysFalse = new FalseSpec();

    it('can be validated for true-true', function(done) {
      var flag = alwaysTrue.and(alwaysTrue).isSatisfiedBy({});
      flag.should.be.true;
      done();
    });

    it('can be validated for true-false', function(done) {
      var flag = alwaysTrue.and(alwaysFalse).isSatisfiedBy({});
      flag.should.be.false;
      done();
    });

    it('can be validated for false-true', function(done) {
      var flag = alwaysFalse.and(alwaysTrue).isSatisfiedBy({});
      flag.should.be.false;
      done();
    });

    it('can be validated for false-false', function(done) {
      var flag = alwaysFalse.and(alwaysFalse).isSatisfiedBy({});
      flag.should.be.false;
      done();
    });

    it('can be validated for true-true-true', function(done) {
      var flag = alwaysTrue.and(alwaysTrue).and(alwaysTrue).isSatisfiedBy({});
      flag.should.be.true;
      done();
    });

    it('can be validated for true-true-false', function(done) {
      var flag = alwaysTrue.and(alwaysTrue).and(alwaysFalse).isSatisfiedBy({});
      flag.should.be.false;
      done();
    });

  });

});
