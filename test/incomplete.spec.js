'use strict';

var should = require('should');
var util = require('util');
var bspec = require('./../lib/bspec');

var Spec = bspec.Spec;
var SyncSpec = bspec.SyncSpec;

describe('Incomplete', function() {

  describe('Async specification', function() {

    it('cannot be used', function(done) {

      function OverDueSpec() {
      }
      util.inherits(OverDueSpec, Spec);

      // NOTE: forgot to implement isSatisfiedBy

      var overDue = new OverDueSpec();
      overDue.isSatisfiedBy({}, function(err) {
        should.exist(err);
        done();
      });

    });

  });

  describe('Sync specification', function() {

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

});