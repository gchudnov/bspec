'use strict';

require('es6-promise').polyfill();

var should = require('should');
var util = require('util');
var bspec = require('./../lib/bspec');

var CallbackSpec = bspec.CallbackSpec;
var SyncSpec = bspec.SyncSpec;
var PromiseSpec = bspec.PromiseSpec;


describe('AND Specification', function() {

  describe('Callback', function() {

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

    // ERROR
    function ErrorSpec() {
    }

    util.inherits(ErrorSpec, CallbackSpec);

    ErrorSpec.prototype.isSatisfiedBy = function(dummy, cb) {
      return cb(new Error('cannot satisfy the spec'));
    };

    var alwaysTrue = new TrueSpec();
    var alwaysFalse = new FalseSpec();
    var alwaysError = new ErrorSpec();


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

    it('should return an error for error-true', function(done) {
      alwaysError.and(alwaysTrue).isSatisfiedBy({}, function(err) {
        should.exist(err);
        done();
      });
    });

    it('should return an error for error-false', function(done) {
      alwaysError.and(alwaysFalse).isSatisfiedBy({}, function(err) {
        should.exist(err);
        done();
      });
    });

    it('should return an error for true-error', function(done) {
      alwaysTrue.and(alwaysError).isSatisfiedBy({}, function(err) {
        should.exist(err);
        done();
      });
    });

    it('should return false for false-error', function(done) {
      alwaysFalse.and(alwaysError).isSatisfiedBy({}, function(err, flag) {
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

  describe('Promise', function() {

    // TRUE
    function TrueSpec() {
    }

    util.inherits(TrueSpec, PromiseSpec);

    TrueSpec.prototype.isSatisfiedBy = function() {
      return Promise.resolve(true);
    };

    // FALSE
    function FalseSpec() {
    }

    util.inherits(FalseSpec, PromiseSpec);

    FalseSpec.prototype.isSatisfiedBy = function() {
      return Promise.resolve(false);
    };

    var alwaysTrue = new TrueSpec();
    var alwaysFalse = new FalseSpec();

    it('can be validated for true-true', function(done) {
      alwaysTrue.and(alwaysTrue).isSatisfiedBy({}).then(function(flag) {
        flag.should.be.true;
        done();
      }, function(reason) {
        throw new Error(reason);
      });
    });

    it('can be validated for true-false', function(done) {
      alwaysTrue.and(alwaysFalse).isSatisfiedBy({}).then(function(flag) {
        flag.should.be.false;
        done();
      }, function(reason) {
        throw new Error(reason);
      });
    });

    it('can be validated for false-true', function(done) {
      alwaysFalse.and(alwaysTrue).isSatisfiedBy({}).then(function(flag) {
        flag.should.be.false;
        done();
      }, function(reason) {
        throw new Error(reason);
      });
    });

    it('can be validated for false-false', function(done) {
      alwaysFalse.and(alwaysFalse).isSatisfiedBy({}).then(function(flag) {
        flag.should.be.false;
        done();
      }, function(reason) {
        throw new Error(reason);
      });
    });

    it('can be validated for true-true-true', function(done) {
      alwaysTrue.and(alwaysTrue).and(alwaysTrue).isSatisfiedBy({}).then(function(flag) {
        flag.should.be.true;
        done();
      }, function(reason) {
        throw new Error(reason);
      });
    });

    it('can be validated for true-true-false', function(done) {
      alwaysTrue.and(alwaysTrue).and(alwaysFalse).isSatisfiedBy({}).then(function(flag) {
        flag.should.be.false;
        done();
      }, function(reason) {
        throw new Error(reason);
      });
    });

  });

});
