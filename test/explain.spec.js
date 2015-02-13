'use strict';

require('es6-promise').polyfill();

var should = require('should');
var util = require('util');
var bspec = require('./../lib/bspec');

var CallbackSpec = bspec.CallbackSpec;
var SyncSpec = bspec.SyncSpec;
var PromiseSpec = bspec.PromiseSpec;


describe('Explain', function() {

  it('can be used to print Callback-style specifications', function(done) {

    //
    function OverDueSpec() {
    }

    util.inherits(OverDueSpec, CallbackSpec);

    OverDueSpec.prototype.isSatisfiedBy = function(invoice, cb) {
      return cb(null, true);
    };

    //
    function NoticeSentSpec() {
    }

    util.inherits(NoticeSentSpec, CallbackSpec);

    NoticeSentSpec.prototype.isSatisfiedBy = function(invoice, cb) {
      return cb(null, true);
    };

    //
    function InCollectionSpec() {
    }

    util.inherits(InCollectionSpec, CallbackSpec);

    InCollectionSpec.prototype.isSatisfiedBy = function(invoice, cb) {
      return cb(null, false);
    };

    var overDue = new OverDueSpec();
    var noticeSent = new NoticeSentSpec();
    var inCol = new InCollectionSpec();

    var composite = overDue.and(noticeSent).or(inCol.not());

    var str = composite.explain();
    str.should.be.not.empty;

    composite.isSatisfiedBy({}, function(err, flag) {
      should.not.exist(err);
      flag.should.be.true;

      done();
    });

  });

  it('can be used to print sync specifications', function(done) {

    //
    function OverDueSpec() {
    }

    util.inherits(OverDueSpec, SyncSpec);

    OverDueSpec.prototype.isSatisfiedBy = function(invoice) {
      return true;
    };

    //
    function NoticeSentSpec() {
    }

    util.inherits(NoticeSentSpec, SyncSpec);

    NoticeSentSpec.prototype.isSatisfiedBy = function(invoice) {
      return true;
    };

    //
    function InCollectionSpec() {
    }

    util.inherits(InCollectionSpec, SyncSpec);

    InCollectionSpec.prototype.isSatisfiedBy = function(invoice) {
      return false;
    };

    var overDue = new OverDueSpec();
    var noticeSent = new NoticeSentSpec();
    var inCol = new InCollectionSpec();

    var composite = overDue.and(noticeSent).or(inCol.not());
    var flag = composite.isSatisfiedBy({});
    flag.should.be.true;

    var str = composite.explain();
    str.should.be.not.empty;

    done();
  });

  it('can be used to print promise-based specifications', function(done) {

    //
    function OverDueSpec() {
    }

    util.inherits(OverDueSpec, PromiseSpec);

    OverDueSpec.prototype.isSatisfiedBy = function(invoice) {
      return Promise.resolve(true);
    };

    //
    function NoticeSentSpec() {
    }

    util.inherits(NoticeSentSpec, PromiseSpec);

    NoticeSentSpec.prototype.isSatisfiedBy = function(invoice) {
      return Promise.resolve(false);
    };

    //
    function InCollectionSpec() {
    }

    util.inherits(InCollectionSpec, PromiseSpec);

    InCollectionSpec.prototype.isSatisfiedBy = function(invoice) {
      return Promise.resolve(false);
    };

    var overDue = new OverDueSpec();
    var noticeSent = new NoticeSentSpec();
    var inCol = new InCollectionSpec();

    var composite = overDue.and(noticeSent).or(inCol.not());
    composite.isSatisfiedBy({}).then(function(flag) {
      flag.should.be.true;

      var str = composite.explain();
      str.should.be.not.empty;

      done();
    }, function(reason) {
      throw new Error(reason);
    });
  });

});
