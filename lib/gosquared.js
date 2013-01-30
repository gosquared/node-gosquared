var https = require('https'),
    config = require('../config'),
    h = require('./helpers'),
    queryString = require('querystring'),
    util = require('util'),
    format = util.format
    ;

var debugLevels = {
  TRACE: 1,
  NOTICE: 1<<1,
  WARNING: 1<<2,
  FATAL: 1<<3
};

var messages = {
  requestFailed: 'requestFailed',
  responseEmpty: 'responseEmpty',
  responseParseError: 'responseParseError',
  responseInvalid: 'responseInvalid',
  missingEventName: 'The event must have a name. No name was given.',
  missingSiteToken: 'A site token must be given.'
};

var errors = {
  0: '',
  1: messages.requestFailed,
  2: messages.responseEmpty,
  3: messages.responseParseError,
  4: messages.responseInvalid,
  5: messages.missingEventName,
  6: messages.missingSiteToken,
  7: messages.requestFailed
};

debugLevels.ALL = Math.pow(2, Object.keys(debugLevels).length) -1;

var GoSquared = module.exports = function(opts){
  if(!opts.siteToken){
    return this._debug(6);
  }
  this.opts = h.extend({
    requestTimeout: 2000,
    version: 'latest',
    debugLevel: 'WARNING'
  }, opts);
  this.config = config;
};

GoSquared.prototype._exec = function(endpoint, path, params, cb){
  var self = this;
  var requestPath = path + '?' + queryString.stringify(params);
  var requestOpts = {
    host: endpoint.host,
    port: endpoint.port,
    method: endpoint.method,
    path: requestPath
  };

  this._debug(0, 'TRACE', requestOpts);

  var request = https.request(requestOpts, function(res){
    h.bufferResponse(res, cb);
  });

  request.on('error', function(e){
    self._debug(1, 'WARNING', e);
    return cb(1);
  });

  if(Object.keys(params).length){
    request.write(JSON.stringify(params));
  }
  request.end();

  setTimeout(function(){
    request.destroy();
  }, this.opts.requestTimeout);
};

GoSquared.prototype._validateResponse = function(responseData){
  var err;
  if(!responseData){
    err = 2;
    this._debug(err, 'WARNING');
    return err;
  }
  var parsed = '';
  try{
    parsed = JSON.parse(responseData);
  }
  catch(e){
    err = 3;
    this._debug(err, 'WARNING', e);
    return err;
  }
  if(!parsed){
    err = 4;
    this._debug(err, 'WARNING');
    return err;
  }
  return parsed;
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

GoSquared.prototype.storeEvent = function(name, params, done){
  if(!name){
    return this._debug(5, 'WARNING');
  }

  if(typeof params == 'function'){
    done = params, params = {};
  }
  else if(typeof params != 'object') params = {};

  params.name = name;
  params.site_token = this.opts.siteToken;
  this._exec(this.config.endpoints.data, '/event', params, this._responseCompleted.bind(this, done));
};

GoSquared.prototype._responseCompleted = function(cb, err, responseData){
  if(err){
    this._debug(7, 'WARNING');
    return cb(err);
  }
  var validated = this._validateResponse(responseData);
  if(typeof validated != "object"){
    return cb(validated);
  }

  cb(null, validated);
};

var standardFunctions = config.api.functions;
for (var i = 0; i< standardFunctions.length; i++) {
  var func = standardFunctions[i];
  GoSquared.prototype[func] = (function(func) {
    return function(opts, cb){
      if(typeof opts == 'function') {cb = opts; opts = {};}
      var endpoint = this.config.endpoints.api;
      opts.site_token = this.opts.siteToken;
      opts.api_key = this.opts.apiKey;
      this._exec(endpoint, '/'+this.opts.version+'/'+func, opts, this._responseCompleted.bind(this, cb));
    };
  })(func);
}