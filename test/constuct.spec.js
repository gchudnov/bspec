'use strict';

var should = require('should');
var util = require('util');
var bspec = require('./../lib/bspec');

describe('Specification', function() {

  describe('from plain sync functions', function() {

    function alwaysTrue() { return true; }
    function alwaysFalse() { return false; }
    function alwaysError() { throw new Error('some error'); }

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

  describe('from functions with callback interface', function() {

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

  describe('from sync specification-like objects', function() {

    //
    function BooleanSpec(value) {
      this.value = value;
    }

    BooleanSpec.prototype.isSatisfiedBy = function() {
      return this.value;
    };

    //
    function ErrorSpec() {
    }

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

  describe('from specification-like objects with callback interface', function() {

    //
    function BooleanSpec(value) {
      this.value = value;
    }

    BooleanSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate, cb) {
      return cb(null, this.value);
    };

    //
    function ErrorSpec() {
    }

    ErrorSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate, cb) {
      cb(new Error('some error'));
    };

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

  describe('from sync specifications', function() {

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

  describe('from specifications with callback interface', function() {

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

});
