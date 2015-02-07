'use strict';

var should = require('should');
var util = require('util');
var bspec = require('./../lib/bspec');

var Spec = bspec.Spec;
var SyncSpec = bspec.SyncSpec;


describe('Explain', function() {

  describe('Async', function() {

    it('can be used to get specification structure', function(done) {

      //
      function OverDueSpec() {
      }

      util.inherits(OverDueSpec, Spec);

      OverDueSpec.prototype.isSatisfiedBy = function(invoice, cb) {
        return cb(null, true);
      };

      //
      function NoticeSentSpec() {
      }

      util.inherits(NoticeSentSpec, Spec);

      NoticeSentSpec.prototype.isSatisfiedBy = function(invoice, cb) {
        return cb(null, true);
      };

      //
      function InCollectionSpec() {
      }

      util.inherits(InCollectionSpec, Spec);

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

  });

  describe('Sync', function() {

    it('can be used to get specification structure', function(done) {

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

  });

});
