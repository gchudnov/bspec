'use strict';

var should = require('should');
var bspec = require('./../lib/bspec');


describe('Factory', function() {

  describe('Async', function() {

    function isUserValid(user, cb) {
      cb(null, user && user['is_valid'] === true);
    }

    var validUser = {
      is_valid: true
    };

    var invalidUser = {
      is_valid: false
    };

    var unknownUser = {
      // is_valid not defined
    };

    var isValidUser = bspec.make(isUserValid);

    it('can be used', function(done) {

      isValidUser.isSatisfiedBy(validUser, function(err, flag) {
        should.not.exist(err);
        flag.should.be.true;

        isValidUser.isSatisfiedBy(invalidUser, function(err, flag) {
          should.not.exist(err);
          flag.should.be.false;

          isValidUser.isSatisfiedBy(unknownUser, function(err, flag) {
            should.not.exist(err);
            flag.should.be.false;

            done();
          });
        });
      });

    });

  });

  describe('Sync', function() {

    function isUserValid(user) {
      return (user && user['is_valid'] === true);
    }

    var validUser = {
      is_valid: true
    };

    var invalidUser = {
      is_valid: false
    };

    var unknownUser = {
      // is_valid not defined
    };

    var isValidUser = bspec.makeSync(isUserValid);

    it('can be used', function(done) {

      var flag1 = isValidUser.isSatisfiedBy(validUser);
      flag1.should.be.true;

      var flag2 = isValidUser.isSatisfiedBy(invalidUser);
      flag2.should.be.false;

      var flag3 = isValidUser.isSatisfiedBy(unknownUser);
      flag3.should.be.false;

      done();
    });

  });

});
