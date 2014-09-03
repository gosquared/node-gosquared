var crypto = require('crypto');
var h = require('./helpers');

var Person = module.exports = function(GS, id) {
  this.GS = GS;

  Object.defineProperty(this, 'id', {
    get: function() {
      return this._id;
    },
    set: function(v) {
      v = v.toString();
      this._id = v;
      this.baseURL = '/' + GS.opts.site_token + '/people/' + encodeURIComponent(v);
      this.auth();
    },
    enumerable: true
  });

  if (id) this.id = id;
};

Person.prototype.auth = function() {
  var key = this.GS.opts.peopleKey;
  if (!key) return this.authParams = {};
  return this.authParams = { auth: crypto.createHmac('sha256', key).update(this.id).digest('hex') };
};

Person.prototype._exec = function(url, data, cb) {
  var GS = this.GS;
  if (!cb && typeof data === 'function') {
    cb = data;
    data = {};
  }

  GS._exec(GS.config.endpoints.data, this.baseURL + url, this.authParams, data, GS._responseCompleted.bind(GS, cb));
};

// identify is a quick way to both alias and set properties on a person
Person.prototype.identify = function(newID, data, cb) {
  // if we don't have an anonymous ID, just go straight to adding the data as properties
  if (!this.id) {
    this.id = newID;
    return this.setProperties(data, cb);
  }

  if (!cb && typeof data === 'function') {
    cb = data;
    data = {};
  }

  if (typeof newID === 'object') {
    data = newID;
    newID = data.id;
  }

  // can use identify without a newID
  if (!newID) {
    return this.setProperties(data, cb);
  }

  this._exec('/identify/' + encodeURIComponent(newID), data, cb);
};

Person.prototype.alias = function(newID, cb) {
  this._exec('/alias/' + encodeURIComponent(newID), cb);
  this.id = newID;
};

Person.prototype.setProperties = function(data, cb) {
  this._exec('/properties', data, cb);
};

Person.prototype.event = function(name, data, cb) {
  if(!cb && typeof data == 'function'){
    cb = data;
    data = {};
  }

  data = h.clone(data);
  data.personID = this.id;
  this.GS.event(name, data, cb);
};

Person.prototype.createTransaction = function(transactionID, opts) {
  var t = this.GS.createTransaction(transactionID, opts);
  t.personID = this.id;
  return t;
};
