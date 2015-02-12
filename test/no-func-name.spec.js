'use strict';

var should = require('should');
var util = require('./../lib/detail/util');


describe('Function with no name property', function() {

  it('can be traced', function(done) {

    var f = {
      toString: function() { return 'function myFunc(){}'; }
    };

    var s = util.functionName(f);
    s.should.be.a.String.and.not.empty;

    done();
  });

});
