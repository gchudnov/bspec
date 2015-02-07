'use strict';

var should = require('should');
var util = require('util');
var bspec = require('./../lib/bspec');

var Spec = bspec.Spec;
var SyncSpec = bspec.SyncSpec;


describe('AND Specification', function() {

  describe('Async', function() {

    // TRUE
    function TrueSpec() {
    }

    util.inherits(TrueSpec, Spec);

    TrueSpec.prototype.isSatisfiedBy = function(dummy, cb) {
      return cb(null, true);
    };

    // FALSE
    function FalseSpec() {
    }

    util.inherits(FalseSpec, Spec);

    FalseSpec.prototype.isSatisfiedBy = function(dummy, cb) {
      return cb(null, false);
    };

    var alwaysTrue = new TrueSpec();
    var alwaysFalse = new FalseSpec();


    it('can be validated for true-true', function(done) {
      alwaysTrue.and(alwaysTrue).isSatisfiedBy({}, function(err, flag) {
        should.not.exist(err);
        flag.should.be.true;
        done();
      });
    });

    it('can be validated for true-false', function(done) {
      alwaysTrue.and(alwaysFalse).isSatisfiedBy({}, function(err, flag) {
        should.not.exist(err);
        flag.should.be.false;
        done();
      });
    });

    it('can be validated for false-true', function(done) {
      alwaysFalse.and(alwaysTrue).isSatisfiedBy({}, function(err, flag) {
        should.not.exist(err);
        flag.should.be.false;
        done();
      });
    });

    it('can be validated for false-false', function(done) {
      alwaysFalse.and(alwaysFalse).isSatisfiedBy({}, function(err, flag) {
        should.not.exist(err);
        flag.should.be.false;
        done();
      });
    });

    it('can be validated for true-true-true', function(done) {
      alwaysTrue.and(alwaysTrue).and(alwaysTrue).isSatisfiedBy({}, function(err, flag) {
        should.not.exist(err);
        flag.should.be.true;
        done();
      });
    });

    it('can be validated for true-true-false', function(done) {
      alwaysTrue.and(alwaysTrue).and(alwaysFalse).isSatisfiedBy({}, function(err, flag) {
        should.not.exist(err);
        flag.should.be.false;
        done();
      });
    });

  });

  describe('Sync', function() {

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
