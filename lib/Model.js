var config = require('../config');

var Model = module.exports = function() {};

Model.prototype.get = function(params, cb) {
  if (typeof params === 'function') {
    cb = params;
    params = {};
  }

  this._exec(
    'GET',
    params,
    {},
    cb
  );
};

Model.prototype.post = function(params, data, cb) {
  if (typeof data === 'function') {
    cb = data;
    data = null;
  }

  this._exec(
    'POST',
    params,
    data,
    cb
  );
};

Model.prototype.delete = function(params, cb) {
  if (typeof params === 'function') {
    cb = params;
    params = {};
  }

  this._exec(
    'DELETE',
    params,
    {},
    cb
  );
};

Model.prototype._exec = function(method, params, data, cb) {
  this.GS._exec(
    config.endpoint,
    this.path,
    method,
    params,
    data,
    cb
  );
};
