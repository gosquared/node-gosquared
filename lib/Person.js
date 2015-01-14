var crypto = require('crypto');
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
      v = v.toString();
      this._id = ''+v;
    },
    enumerable: true
  });

  if (id) this.id = id;
};

Person.prototype._exec = function(url, params, data, cb) {
  var GS = this.GS;
  GS._exec(config.endpoint + '/tracking/v1', url, 'POST', params, data, cb);
};

// identify is a quick way to both alias and set properties on a person
Person.prototype.identify = function(newID, props, cb) {
  // if we don't have an anonymous ID, just go straight to adding the data as properties
  if (!this.id) {
    this.id = newID;
    return this.setProperties(props, cb);
  }

  if (!cb && typeof props === 'function') {
    cb = props;
    props = {};
  }

  if (typeof newID === 'object') {
    props = newID;
    newID = props.id;
  }

  // can use identify without a newID
  if (!newID) {
    return this.setProperties(props, cb);
  }

  var data = { visitor_id: this.id, person_id: ''+newID };
  if (props) data.properties = props;
  this._exec('/identify', {}, data, cb);
};

Person.prototype.alias = function(newID, cb) {
  var data = { visitor_id: this.id, person_id: ''+newID };
  this.id = newID;
  this._exec('/alias', {}, data, cb);
};

Person.prototype.setProperties = function(props, cb) {
  var data = { person_id: this.id, properties: props };
  this._exec('/properties', {}, data, cb);
};

Person.prototype.trackEvent = function(name, data, cb) {
  if (typeof data === 'function') {
    cb = data;
    data = {};
  }

  var event = new Event(this.GS, name, data);
  event.personID = this.id;
  event.track(cb);
};

Person.prototype.createTransaction = function(transactionID, opts) {
  var t = new Transaction(this.GS, transactionID, opts);
  t.personID = this.id;
  return t;
};
