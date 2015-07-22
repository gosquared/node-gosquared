var utils = require('./utils');
var Transaction = require('./Transaction');
var Event = require('./Event');
var config = require('../config');

var Person = module.exports = function(GS, id) {
  this.GS = GS;

  Object.defineProperty(this, 'id', {
    get: function() {
      return this._id;
    },
    set: function(v) {
      if (!v) return;

      if (typeof v === 'object') {
        // try to grab the id property out of the object
        if (v.id) {
          this._id = v.id;

        // no id, try email
        } else if (v.email) {
          this._id = 'email:' + v.email;
        }
      } else {
        this._id = v;
      }

      // ensure it's a string
      if (this._id) this._id = this._id.toString();
    },
    enumerable: true
  });

  if (id) this.id = id;

  this.anonymousID = undefined;
};

Person.prototype._exec = function(url, params, data, cb) {
  var GS = this.GS;
  GS._exec(config.endpoint + '/tracking/v1', url, 'POST', params, data, cb);
};

Person.prototype._verifyID = function(cb) {
  if (!this.id && !this.anonymousID) {
    setImmediate(function() {
      cb(new Error('Missing ID and anonymousID'));
    });
    return false;
  }

  return true;
};

// identify is very similar to setProperties but requires an identifying property (id or email)
Person.prototype.identify = function(props, cb) {

  if (!props.id && !props.email) {
    setImmediate(function() {
      cb(new Error('Missing ID and email'));
    });
    return;
  }

  this.id = props;

  this._exec('/identify', {}, {
    visitor_id: this.anonymousID,
    person_id: this.id,
    properties: props
  }, cb);
};

Person.prototype.setProperties = function(props, cb) {
  if (props.id || props.email) this.id = props;

  if (!this._verifyID(cb)) return;

  this._exec('/properties', {}, {
    visitor_id: this.anonymousID,
    person_id: this.id,
    properties: props
  }, cb);
};

Person.prototype.trackEvent = function(name, data, cb) {
  if (typeof data === 'function') {
    cb = data;
    data = {};
  }

  if (!this._verifyID(cb)) return;

  var event = new Event(this.GS, name, data);
  event.personID = this.id;
  event.anonymousID = this.anonymousID;
  event.track(cb);
};

Person.prototype.createTransaction = function(transactionID, opts) {
  // not too sure how to nicely error here if theres no ID.
  // the transaction will work, but won't be associated with a person
  // should we throw?
  // if (!this._verifyID(cb)) return;

  var t = new Transaction(this.GS, transactionID, opts);
  t.personID = this.id;
  t.anonymousID = this.anonymousID;
  return t;
};
