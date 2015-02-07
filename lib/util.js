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
