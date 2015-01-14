var Account = require('./api/Account');
var Now = require('./api/Now');
var Trends = require('./api/Trends');
var Ecommerce = require('./api/Ecommerce');
var Tracking = require('./api/Tracking');
var request = require('request');
var utils = require('./utils');

var GoSquared = module.exports = function(opts) {
  this.opts = utils.extend({
    log: function() {},
    requestTimeout: 10000
  }, opts);

  this.apiParams = {
    site_token: this.opts.site_token || this.opts.siteToken,
    api_key: this.opts.api_key || this.opts.apiKey
  };

  this.log = this.opts.log;

  this.account = new Account(this);
  this.now = new Now(this);
  this.trends = new Trends(this);
  this.ecommerce = new Ecommerce(this);
  this.tracking = new Tracking(this);
};

GoSquared.prototype._exec = function(endpoint, path, method, params, data, cb){
  if (!cb && typeof data === 'function') {
    cb = data;
    data = {};
  }

  if (!cb) cb = function() {};

  params = utils.extend({}, params, this.apiParams);

  var req = {
    url: endpoint + path,
    qs: params,
    method: method,
    json: true,
    body: data,
    timeout: this.opts.requestTimeout
  };

  this.log(req);

  request(req, function(err, res, body) {
    if (err) return cb(err);

    if (!body) {
      err = new Error('Empty response');
      err.httpStatus = res.statusCode;
      return cb(err, { success: false });
    }

    if (!body.success && res.statusCode !== 200) {
      err = new Error(body.message || 'HTTP ' + res.statusCode);
      err.code = body.code;
      err.httpStatus = res.statusCode;
    }

    cb(err, body);
  });
};
