var request = require('request');
var config = require('../config');
var h = require('./helpers');
var queryString = require('querystring');
var util = require('util');
var format = util.format;
var Transaction = require('./Transaction');
var Person = require('./Person');

var debugLevels = {
  NONE: 0,
  TRACE: 1,
  NOTICE: 1<<1,
  WARNING: 1<<2,
  FATAL: 1<<3
};
debugLevels.ALL = Math.pow(2, Object.keys(debugLevels).length) -1;

var messages = {
  requestFailed: 'requestFailed',
  responseEmpty: 'responseEmpty',
  responseParseError: 'responseParseError',
  responseInvalid: 'responseInvalid',
  missingEventName: 'The event must have a name. No name was given.',
  missingSiteToken: 'A site token must be given.',
  paramsTooLarge: 'The event parameters were too large. Send fewer / smaller parameters.',
  non200Code: 'The HTTP request completed with a non-200 status code.',
  errorEncountered: 'The GoSquared server didn\'t like something, so it gave us an error.'
};

var errors = {
  0: '',
  1: messages.requestFailed,
  2: messages.responseEmpty,
  3: messages.responseParseError,
  4: messages.responseInvalid,
  5: messages.missingEventName,
  6: messages.missingSiteToken,
  7: messages.requestFailed,
  8: messages.paramsTooLarge,
  9: messages.non200Code,
  10: messages.errorEncountered,

  100: "Transaction items must have a name",
  101: "Transactions must have an ID"
};


var GoSquared = module.exports = function(opts){

  this.opts = h.extend({
    requestTimeout: 10000,
    debugLevel: 'NONE'
  }, opts);

  if(!this.opts.site_token){
    this._debug(6);
  }

  this.config = config;

  this.setupMethods();
};

GoSquared.prototype._exec = function(endpoint, path, params, data, cb){
  var self = this;

  if (!cb && typeof data === 'function') {
    cb = data;
    data = {};
  }

  var req = {
    url: endpoint.url + path,
    qs: params,
    method: endpoint.method,
    json: true,
    data: data,
    timeout: this.opts.requestTimeout
  };

  this._debug(0, 'TRACE', req);

  request(req, function(err, res, body) {
    if (err) self._debug(1, 'WARNING', { error: err, req: req });
    cb(err, body);
  });
};

GoSquared.prototype._validateResponse = function(responseData){
  var err;

  if(!responseData){
    err = 2;
    this._debug(err, 'WARNING');
    return err;
  }

  if (!responseData.success && responseData.error) {
    var errObj = responseData.error;
    switch(errObj.code){
      case 1011:
        err = 8;
        this._debug(err, 'WARNING', errObj);
        return err;
      default:
        err = 10;
        this._debug(err, 'WARNING', errObj);
        return err;
    }
  }
  return responseData;
};

GoSquared.prototype._debug = function(code, level, extra){
  var dLevel = this.opts.debugLevel || 'ALL';

  if(!(debugLevels[dLevel] & debugLevels[level])) return false;

  var stream = console.log;

  if(level > debugLevels['NOTICE']) stream = console.error;

  // Errors are machine-parseable
  stream(
    format(
      '[GoSquared][%s]:%s', level, JSON.stringify({message: errors[code], code: code, extra: extra})
    )
  );
};

GoSquared.prototype._makeError = function(code){
  var err = new Error(errors[code]);
  err.code = code;
  return err;
};

GoSquared.prototype.event = function(name, data, cb) {
  if(typeof data === 'function'){
    cb = data;
    data = {};
  }

  if(!name){
    this._debug(5, 'WARNING');
    return cb && cb(this._makeError(5));
  }

  this._exec(this.config.endpoints.data, '/' + this.opts.site_token + '/v1/event', { name: name }, data, this._responseCompleted.bind(this, cb));
};

GoSquared.prototype.createTransaction = GoSquared.prototype.Transaction = function(transactionID, opts){
  return new Transaction(this, transactionID, opts);
};

GoSquared.prototype.createPerson = GoSquared.prototype.Person = function(id, opts){
  return new Person(this, id);
};

GoSquared.prototype._responseCompleted = function(cb, err, responseData){
  if (!cb) cb = function(){};

  if(err){
    this._debug(7, 'WARNING');
    return cb(err);
  }

  var validated = this._validateResponse(responseData);

  if (typeof validated !== "object") {
    if (typeof validated === "number") {
      err = this._makeError(validated);
    }
    return cb(err);
  }

  cb(null, validated);
};

var createMethod = function(namespace, version, func) {
  var self = this;

  return function(opts, cb){

    if (typeof opts == 'function'){
      cb = opts;
      opts = {};
    }

    if (typeof opts != 'object') opts = {};

    if (typeof cb != 'function') cb = function(){};

    var endpoint = self.config.endpoints.api;
    opts.site_token = opts.site_token || self.opts.site_token;
    opts.api_key = opts.api_key || self.opts.api_key;
    self._exec(endpoint, '/' + namespace + '/'+ version + '/' + func, opts, self._responseCompleted.bind(self, cb));
  };
};

/**
 * Create API methods nested in properties that reflect the API structure
 *
 * GoSquared[namespace][version][function]
 *
 * Also, for default versions:
 *
 * GoSquared[namespace][function]
 *
 */
GoSquared.prototype.setupMethods = function() {
  var self = this;

  // set up the methods for each version and namespace
  var functions = config.api;
  for (var namespace in functions) {

    var n = self[namespace];

    // ensure object exists
    if (!n) n = self[namespace] = {};

    for (var version in functions[namespace]) {
      if (version === 'def') continue;

      var v = n[version];

      // ensure version object exists
      if (!v) v = n[version] = {};

      var fncs = functions[namespace][version];

      for (var i = 0; i < fncs.length; i++) {
        var f = v[fncs[i]] = createMethod.call(self, namespace, version, fncs[i]);

        // is this the default version?
        if (version === functions[namespace]['def']) {

          // set it on the namespace (e.g. $.GoSquared.now.concurrents)
          n[fncs[i]] = f;
        }
      }
    }
  }
};
