'use strict';

require('es6-promise').polyfill();

var should = require('should');
var util = require('util');
var bspec = require('./../lib/bspec');

var CallbackSpec = bspec.CallbackSpec;
var SyncSpec = bspec.SyncSpec;
var PromiseSpec = bspec.PromiseSpec;


describe('NOT Specification', function() {

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

    it('should return an error for error', function(done) {
      alwaysError.not().isSatisfiedBy({}, function(err) {
        should.exist(err);
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


    it('can be validated for !true', function(done) {
      alwaysTrue.not().isSatisfiedBy({}).then(function(flag) {
        flag.should.be.false;
        done();
      }, function(reason) {
        throw new Error(reason);
      });
    });

    it('can be validated for !false', function(done) {
      alwaysFalse.not().isSatisfiedBy({}).then(function(flag) {
        flag.should.be.true;
        done();
      }, function(reason) {
        throw new Error(reason);
      });
    });

  });

});
