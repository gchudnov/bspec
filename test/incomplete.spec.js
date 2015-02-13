'use strict';

require('es6-promise').polyfill();

var should = require('should');
var util = require('util');
var bspec = require('./../lib/bspec');

var CallbackSpec = bspec.CallbackSpec;
var SyncSpec = bspec.SyncSpec;
var PromiseSpec = bspec.PromiseSpec;


describe('Incomplete', function() {

  describe('Callback-based specification', function() {

    it('cannot be constructed', function(done) {
      (function() {
        new CallbackSpec(123);
      }).should.throw();
      done();
    });

    it('cannot be used', function(done) {

      function OverDueSpec() {
      }
      util.inherits(OverDueSpec, CallbackSpec);

      // NOTE: forgot to implement isSatisfiedBy

      var overDue = new OverDueSpec();
      overDue.isSatisfiedBy({}, function(err) {
        should.exist(err);
        done();
      });

    });

  });

  describe('Sync specification', function() {

    it('cannot be constructed', function(done) {
      (function() {
        new SyncSpec(123);
      }).should.throw();
      done();
    });

    it('cannot be used', function(done) {

      function OverDueSpec() {
      }
      util.inherits(OverDueSpec, SyncSpec);

      // NOTE: forgot to implement isSatisfiedBy

      var overDue = new OverDueSpec();
      (function() {
        overDue.isSatisfiedBy({});
      }).should.throw();

      done();
    });

  });

  describe('Promise-based specification', function() {

    it('cannot be constructed', function(done) {
      (function() {
        new PromiseSpec(123);
      }).should.throw();
      done();
    });

    it('cannot be used', function(done) {

      function OverDueSpec() {
      }
      util.inherits(OverDueSpec, PromiseSpec);

      // NOTE: forgot to implement isSatisfiedBy

      var overDue = new OverDueSpec();
      overDue.isSatisfiedBy({}).then(function(flag) {
        throw new Error('should not be here');
      }, function(reason) {
        should.exist(reason);
        done();
      });

    });

  });

});