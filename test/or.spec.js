'use strict';

var should = require('should');
var util = require('util');
var bspec = require('./../lib/bspec');

var Spec = bspec.Spec;
var SyncSpec = bspec.SyncSpec;

describe('OR Specification', function() {

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

    // ERROR
    function ErrorSpec() {
    }

    util.inherits(ErrorSpec, Spec);

    ErrorSpec.prototype.isSatisfiedBy = function(dummy, cb) {
      return cb(new Error('cannot satisfy the spec'));
    };

    var alwaysTrue = new TrueSpec();
    var alwaysFalse = new FalseSpec();
    var alwaysError = new ErrorSpec();


    it('can be validated for true-true', function(done) {
      alwaysTrue.or(alwaysTrue).isSatisfiedBy({}, function(err, flag) {
        should.not.exist(err);
        flag.should.be.true;
        done();
      });
    });

    it('can be validated for true-false', function(done) {
      alwaysTrue.or(alwaysFalse).isSatisfiedBy({}, function(err, flag) {
        should.not.exist(err);
        flag.should.be.true;
        done();
      });
    });

    it('can be validated for false-true', function(done) {
      alwaysFalse.or(alwaysTrue).isSatisfiedBy({}, function(err, flag) {
        should.not.exist(err);
        flag.should.be.true;
        done();
      });
    });

    it('can be validated for false-false', function(done) {
      alwaysFalse.or(alwaysFalse).isSatisfiedBy({}, function(err, flag) {
        should.not.exist(err);
        flag.should.be.false;
        done();
      });
    });

    it('can be validated for true-true-true', function(done) {
      alwaysTrue.or(alwaysTrue).or(alwaysTrue).isSatisfiedBy({}, function(err, flag) {
        should.not.exist(err);
        flag.should.be.true;
        done();
      });
    });

    it('can be validated for true-true-false', function(done) {
      alwaysTrue.or(alwaysTrue).or(alwaysFalse).isSatisfiedBy({}, function(err, flag) {
        should.not.exist(err);
        flag.should.be.true;
        done();
      });
    });

    it('should return an error for error-true', function(done) {
      alwaysError.or(alwaysTrue).isSatisfiedBy({}, function(err) {
        should.exist(err);
        done();
      });
    });

    it('should return an error for error-false', function(done) {
      alwaysError.or(alwaysFalse).isSatisfiedBy({}, function(err) {
        should.exist(err);
        done();
      });
    });

    it('should return an error for false-error', function(done) {
      alwaysFalse.or(alwaysError).isSatisfiedBy({}, function(err) {
        should.exist(err);
        done();
      });
    });

    it('should return true for true-error', function(done) {
      alwaysTrue.or(alwaysError).isSatisfiedBy({}, function(err, flag) {
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

    it('can be validated for true-true', function(done) {
      var flag = alwaysTrue.or(alwaysTrue).isSatisfiedBy({});
      flag.should.be.true;
      done();
    });

    it('can be validated for true-false', function(done) {
      var flag = alwaysTrue.or(alwaysFalse).isSatisfiedBy({});
      flag.should.be.true;
      done();
    });

    it('can be validated for false-true', function(done) {
      var flag = alwaysFalse.or(alwaysTrue).isSatisfiedBy({});
      flag.should.be.true;
      done();
    });

    it('can be validated for false-false', function(done) {
      var flag = alwaysFalse.or(alwaysFalse).isSatisfiedBy({});
      flag.should.be.false;
      done();
    });

    it('can be validated for true-true-true', function(done) {
      var flag = alwaysTrue.or(alwaysTrue).or(alwaysTrue).isSatisfiedBy({});
      flag.should.be.true;
      done();
    });

    it('can be validated for true-true-false', function(done) {
      var flag = alwaysTrue.or(alwaysTrue).or(alwaysFalse).isSatisfiedBy({});
      flag.should.be.true;
      done();
    });

  });

});
