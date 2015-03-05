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
    throw new Error('invalid argument: must be a function, spec-like or a spec object');
  }

  if(func instanceof BaseSpec) {
    return func;
  }

  return makeWrapper(func, BaseSpec);
}

