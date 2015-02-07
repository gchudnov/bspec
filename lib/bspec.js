'use strict';

var util = require('util');

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

module.exports.Spec = Spec;


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
  Spec.call(this);
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

/**
 * Create a new basic async specification
 * @param func isSatisfiedBy function, provided by a user
 * @returns {Spec}
 */
function make(func) {
  function BasicSpec() {
  }
  util.inherits(BasicSpec, Spec);
  BasicSpec.prototype.isSatisfiedBy = func;
  return new BasicSpec();
}

module.exports.make = make;


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

module.exports.SyncSpec = SyncSpec;


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


// NOT
function SyncNotSpec(other) {
  SyncSpec.call(this);
  this.other = other;
}

util.inherits(SyncNotSpec, SyncSpec);

SyncNotSpec.prototype.isSatisfiedBy = function isSatisfiedBy(candidate) {
  return !this.other.isSatisfiedBy(candidate);
};


/**
 * Create a new basic sync specification
 * @param func isSatisfiedBy function, provided by a user
 * @returns {Spec}
 */
function makeSync(func) {
  function BasicSyncSpec() {
  }
  util.inherits(BasicSyncSpec, SyncSpec);
  BasicSyncSpec.prototype.isSatisfiedBy = func;
  return new BasicSyncSpec();
}

module.exports.makeSync = makeSync;
