/*
 * bspec - A JavaScript library for structuring business rules
 * @version v0.9.1
 * @author Grigoriy Chudnov <g.chudnov@gmail.com> (https://github.com/gchudnov)
 * @link https://github.com/gchudnov/bspec
 * @license MIT
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.bspec=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var util = require('./util');

//
// Async
//

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

Spec.prototype.explain = function explain() {
  return util.functionName(this.constructor);
};

exports.Spec = Spec;


// AND
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

// OR
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

// NOT
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

/**
 * Create a new basic async specification
 * @param func isSatisfiedBy function, provided by a user
 * @returns {Spec}
 */
function make(func) {
  function BasicSpec() {
    Spec.call(this);
  }
  util.inherits(BasicSpec, Spec);
  BasicSpec.prototype.isSatisfiedBy = func;
  return new BasicSpec();
}

exports.make = make;


//
// Sync
//

function SyncSpec() {
}

SyncSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate) {
  throw new Error('isSatisfiedBy not implemented');
};

SyncSpec.prototype.and = function and(other) {
  return new SyncAndSpec(this, other);
};

SyncSpec.prototype.or = function or(other) {
  return new SyncOrSpec(this, other);
};

SyncSpec.prototype.not = function or(other) {
  return new SyncNotSpec(this);
};

SyncSpec.prototype.explain = function explain() {
  return util.functionName(this.constructor);
};

exports.SyncSpec = SyncSpec;


// AND
function SyncAndSpec(lhs, rhs) {
  SyncSpec.call(this);
  this.lhs = lhs;
  this.rhs = rhs;
}

util.inherits(SyncAndSpec, SyncSpec);

SyncAndSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate) {
  return this.lhs.isSatisfiedBy(candidate) && this.rhs.isSatisfiedBy(candidate);
};

SyncAndSpec.prototype.explain = function explain() {
  return '(' + this.lhs.explain() + ' AND ' + this.rhs.explain() + ')';
};

// OR
function SyncOrSpec(lhs, rhs) {
  SyncSpec.call(this);
  this.lhs = lhs;
  this.rhs = rhs;
}

util.inherits(SyncOrSpec, SyncSpec);

SyncOrSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate) {
  return this.lhs.isSatisfiedBy(candidate) || this.rhs.isSatisfiedBy(candidate);
};

SyncOrSpec.prototype.explain = function explain() {
  return '(' + this.lhs.explain() + ' OR ' + this.rhs.explain() + ')';
};

// NOT
function SyncNotSpec(other) {
  SyncSpec.call(this);
  this.other = other;
}

util.inherits(SyncNotSpec, SyncSpec);

SyncNotSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate) {
  return !this.other.isSatisfiedBy(candidate);
};

SyncNotSpec.prototype.explain = function explain() {
  return '(NOT ' + this.other.explain() + ')';
};


/**
 * Create a new basic sync specification
 * @param func isSatisfiedBy function, provided by a user
 * @returns {Spec}
 */
function makeSync(func) {
  function BasicSyncSpec() {
    SyncSpec.call(this);
  }
  util.inherits(BasicSyncSpec, SyncSpec);
  BasicSyncSpec.prototype.isSatisfiedBy = func;
  return new BasicSyncSpec();
}

exports.makeSync = makeSync;

},{"./util":2}],2:[function(require,module,exports){
'use strict';

var functionNameRx = /^\s*function\s*(\S*)\s*\(/;

/**
 * get the function name
 * @param f
 * @returns {*}
 */
exports.functionName = function(f) {
  if(f.name) {
    return f.name;
  }
  return f.toString().match(functionNameRx)[1];
};

/**
 * Inherit the prototype methods from one constructor into another.
 * @param ctor
 * @param superCtor
 */
exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

},{}]},{},[1])(1)
});