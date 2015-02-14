/*
 * bspec - A JavaScript library for structuring business rules
 * @version v0.10.0
 * @author Grigoriy Chudnov <g.chudnov@gmail.com> (https://github.com/gchudnov)
 * @link https://github.com/gchudnov/bspec
 * @license MIT
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.bspec=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var PromiseSpec = require('./detail/promise');
var CallbackSpec = require('./detail/callback');
var SyncSpec = require('./detail/sync');

module.exports.PromiseSpec = PromiseSpec;
module.exports.CallbackSpec = CallbackSpec;
module.exports.SyncSpec = SyncSpec;

},{"./detail/callback":2,"./detail/promise":3,"./detail/sync":4}],2:[function(require,module,exports){
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

},{"./util":5}],3:[function(require,module,exports){
'use strict';

var util = require('./util');


/**
 * Specification base
 * @constructor
 */
function Spec() {
  if(arguments.length) {
    return util.ensureSpec(arguments[0], Spec);
  }
}

Spec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate) {
  return Promise.reject(new Error('some error'));
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

AndSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate) {
  return Promise.all([this.lhs.isSatisfiedBy(candidate), this.rhs.isSatisfiedBy(candidate)]).then(function(values) {
    return values[0] && values[1];
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

OrSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate) {
  return Promise.all([this.lhs.isSatisfiedBy(candidate), this.rhs.isSatisfiedBy(candidate)]).then(function(values) {
    return values[0] || values[1];
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

NotSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate) {
  return Promise.resolve(this.other.isSatisfiedBy(candidate)).then(function(value) {
    return !value;
  });
};

NotSpec.prototype.explain = function explain() {
  return '(NOT ' + this.other.explain() + ')';
};


module.exports = Spec;

},{"./util":5}],4:[function(require,module,exports){
'use strict';

var util = require('./util');


/**
 * Specification base
 * @constructor
 */
function Spec() {
  if(arguments.length) {
    return util.ensureSpec(arguments[0], Spec);
  }
}

Spec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate) {
  throw new Error('isSatisfiedBy not implemented');
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

AndSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate) {
  return this.lhs.isSatisfiedBy(candidate) && this.rhs.isSatisfiedBy(candidate);
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

OrSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate) {
  return this.lhs.isSatisfiedBy(candidate) || this.rhs.isSatisfiedBy(candidate);
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

NotSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate) {
  return !this.other.isSatisfiedBy(candidate);
};

NotSpec.prototype.explain = function explain() {
  return '(NOT ' + this.other.explain() + ')';
};


module.exports = Spec;

},{"./util":5}],5:[function(require,module,exports){
'use strict';

exports.functionName = functionName;
exports.inherits = inherits;
exports.ensureSpec = ensureSpec;


var functionNameRx = /^\s*function\s*(\S*)\s*\(/;

/**
 * get the function name
 * @param f
 * @returns {*}
 */
function functionName(f) {
  if(f.name) {
    return f.name;
  }
  return f.toString().match(functionNameRx)[1];
}

/**
 * Inherit the prototype methods from one constructor into another.
 * @param ctor
 * @param superCtor
 */
function inherits(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}

/**
 * Check that argument is a function
 * @param arg
 * @returns {boolean}
 */
function isFunction(arg) {
  return typeof arg === 'function';
}

/**
 * Check that argument is an object
 * @param arg
 * @returns {boolean}
 */
function isObject(arg) {
  return arg !== null && typeof arg === 'object';
}

/**
 * Check whether the provided argument can be used in place of a specification
 * @param arg
 * @param BaseSpec
 */
function isSpecLike(arg, BaseSpec) {
  return (arg && (isFunction(arg) || (isObject(arg) && (('isSatisfiedBy' in arg) && isFunction(arg.isSatisfiedBy)) || (arg instanceof BaseSpec))));
}

/**
 * Create a wrapper for a func
 * @param func
 * @param BaseSpec
 */
function makeWrapper(func, BaseSpec) {
  function WrapperSpec() {
    BaseSpec.call(this);
  }

  inherits(WrapperSpec, BaseSpec);

  WrapperSpec.prototype.isSatisfiedBy = ('isSatisfiedBy' in func) ? func.isSatisfiedBy.bind(func) : func;

  return new WrapperSpec();
}

/**
 * Ensure the provided function is a specification-like object
 * @param func
 * @param BaseSpec
 * @returns {*}
 */
function ensureSpec(func, BaseSpec) {
  if(!isSpecLike(func, BaseSpec)) {
    throw new Error('invalid argument: must be a function, spec-like or spec object');
  }

  if(func instanceof BaseSpec) {
    return func;
  }

  return makeWrapper(func, BaseSpec);
}


},{}]},{},[1])(1)
});