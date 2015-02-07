'use strict';

var should = require('should');
var util = require('util');
var bspec = require('./../lib/bspec');

var Spec = bspec.Spec;
var SyncSpec = bspec.SyncSpec;

describe('NOT Specification', function() {

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


    it('can be validated for !true', function(done) {
      alwaysTrue.not().isSatisfiedBy({}, function(err, flag) {
        should.not.exist(err);
        flag.should.be.false;
        done();
      });
    });

    it('can be validated for !false', function(done) {
      alwaysFalse.not().isSatisfiedBy({}, function(err, flag) {
        should.not.exist(err);
        flag.should.be.true;
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


    it('can be validated for !true', function(done) {
      var flag = alwaysTrue.not().isSatisfiedBy({});
      flag.should.be.false;
      done();
    });

    it('can be validated for !false', function(done) {
      var flag = alwaysFalse.not().isSatisfiedBy({});
      flag.should.be.true;
      done();
    });

  });

});
