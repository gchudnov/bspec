'use strict';

var util = require('util');


function Spec() {
}

Spec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate, cb) {
  cb(new Error('isSatisfiedBy not implemented'));
};

Spec.prototype.and = function and(other) {
  return new AndSpec(this, other);
};

Spec.prototype.or = function or(other) {
  return new OrSpec(this, other);
};

Spec.prototype.not = function or(other) {
  return new NotSpec(this);
};


// AND
function AndSpec(lhs, rhs) {
  this.lhs = lhs;
  this.rhs = rhs;
}

util.inherits(AndSpec, Spec);

AndSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate, cb) {
  var self = this;
  self.lhs.isSatisfiedBy(candidate, function(err, flag) {
    if(err) {
      return cb(err);
    }

    if(!flag) {
      return cb(null, flag);
    }

    self.rhs.isSatisfiedBy(candidate, function(err, flag) {
      if(err) {
        return cb(err);
      }

      return cb(null, flag);
    });
  });
};

// OR
function OrSpec(lhs, rhs) {
  this.lhs = lhs;
  this.rhs = rhs;
}

util.inherits(OrSpec, Spec);

OrSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate, cb) {
  var self = this;
  self.lhs.isSatisfiedBy(candidate, function(err, flag) {
    if(err) {
      cb(err);
    }

    if(flag) {
      return cb(null, flag);
    }

    self.rhs.isSatisfiedBy(candidate, function(err, flag) {
      if(err) {
        return cb(err);
      }

      cb(null, flag);
    });
  });
};


// NOT
function NotSpec(other) {
  this.other = other;
}

util.inherits(NotSpec, Spec);

NotSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate, cb) {
  this.other.isSatisfiedBy(candidate, function(err, flag) {
    if(err) {
      return cb(err);
    }

    cb(null, !flag);
  });
};

module.exports.Spec = Spec;
