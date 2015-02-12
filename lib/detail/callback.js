'use strict';

var util = require('./util');


/**
 * Specification base
 * @returns {*}
 * @constructor
 */
function Spec() {
  if(arguments.length) {
    return util.ensureSpec(arguments[0], Spec);
  }
}

Spec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate, cb) {
  cb(new Error('isSatisfiedBy not implemented'));
};

Spec.prototype.and = function and(other) {
  other = util.ensureSpec(other, Spec);
  return new AndSpec(this, other);
};

Spec.prototype.or = function or(other) {
  other = util.ensureSpec(other, Spec);
  return new OrSpec(this, other);
};

Spec.prototype.not = function not() {
  return new NotSpec(this);
};

Spec.prototype.explain = function explain() {
  return util.functionName(this.constructor);
};


/**
 * AND Specification
 * @param lhs
 * @param rhs
 * @constructor
 */
function AndSpec(lhs, rhs) {
  Spec.call(this);
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

AndSpec.prototype.explain = function explain() {
  return '(' + this.lhs.explain() + ' AND ' + this.rhs.explain() + ')';
};


/**
 * OR Specification
 * @param lhs
 * @param rhs
 * @constructor
 */
function OrSpec(lhs, rhs) {
  Spec.call(this);
  this.lhs = lhs;
  this.rhs = rhs;
}

util.inherits(OrSpec, Spec);

OrSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate, cb) {
  var self = this;
  self.lhs.isSatisfiedBy(candidate, function(err, flag) {
    if(err) {
      return cb(err);
    }

    if(flag) {
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

OrSpec.prototype.explain = function explain() {
  return '(' + this.lhs.explain() + ' OR ' + this.rhs.explain() + ')';
};


/**
 * NOT Specification
 * @param other
 * @constructor
 */
function NotSpec(other) {
  Spec.call(this);
  this.other = other;
}

util.inherits(NotSpec, Spec);

NotSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate, cb) {
  this.other.isSatisfiedBy(candidate, function(err, flag) {
    if(err) {
      return cb(err);
    }

    return cb(null, !flag);
  });
};

NotSpec.prototype.explain = function explain() {
  return '(NOT ' + this.other.explain() + ')';
};


module.exports = Spec;
