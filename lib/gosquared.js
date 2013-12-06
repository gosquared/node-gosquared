var http = require('http'),
    https = require('https'),
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
  missingSiteToken: 'A site token must be given.',
  paramsTooLarge: 'The event parameters were too large. Send fewer / smaller parameters.',
  non200Code: 'The HTTP request completed with a non-200 status code.',
  errorEncountered: 'The GoSquared server did\'t like something, so it gave us an error.'
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
  10: messages.errorEncountered
};

debugLevels.ALL = Math.pow(2, Object.keys(debugLevels).length) -1;

var GoSquared = module.exports = function(opts){
  if(!(this instanceof GoSquared)){
    return new GoSquared(opts);
  }

  this.opts = h.extend({
    requestTimeout: 2000,
    debugLevel: 'WARNING'
  }, opts);

  if(!this.opts.site_token){
    this._debug(6);
  }

  this.config = config;
};

GoSquared.prototype._exec = function(endpoint, path, params, cb){
  var self = this;
  var requestPath = path;
  var requestOpts = {
    host: endpoint.hostname,
    port: endpoint.port,
    method: endpoint.method,
    path: requestPath + '?' + queryString.stringify(params)
  };
  var haveParams = !!Object.keys(params).length;
  var d = '', dLength = 0;

  if(requestOpts.method == 'POST' && haveParams){
    d = JSON.stringify(params);
    dLength = d.length;
    requestOpts.headers = {
      'Content-Type': 'application/json'
      // No need to specify Content-Length because this is raw HTTP body
    };
  }

  this._debug(0, 'TRACE', {requestOpts: requestOpts, bodySize: dLength});

  var request = (endpoint.protocol == 'https:' ? https : http).request(requestOpts, function(res){
    if(res.statusCode != 200){
      self._debug(9, 'WARNING', 'The status code received was ' + res.statusCode);
    }
    h.bufferResponse(res, cb);
  });

  request.on('error', function(e){
    self._debug(1, 'WARNING', {error: e, bodySize: dLength});
    return cb(self._makeError(1));
  });

  if(haveParams){
    request.write(d);
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
    this._debug(err, 'WARNING', {error: e, responseData: responseData});
    return err;
  }
  if(!parsed){
    err = 4;
    this._debug(err, 'WARNING', {responseData: responseData});
    return err;
  }
  if(!parsed.success && parsed.error){
    var errObj = parsed.error;
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

GoSquared.prototype._makeError = function(code){
  var err = new Error(errors[code]);
  err.code = code;
  return err;
};

GoSquared.prototype.storeEvent = function(name, params, done){
  if(typeof params == 'function'){
    done = params, params = {};
  }
  else if(typeof params != 'object') params = {};

  if(typeof done !== 'function'){
    done = function(){};
  }

  if(!name){
    this._debug(5, 'WARNING');
    return done(this._makeError(5));
  }

  var qsParams = {};
  qsParams.name = name;
  qsParams.site_token = this.opts.site_token;
  this._exec(this.config.endpoints.data, '/event?' + queryString.stringify(qsParams), params, this._responseCompleted.bind(this, done));
};

GoSquared.prototype._responseCompleted = function(cb, err, responseData){
  if(err){
    this._debug(7, 'WARNING');
    return cb(err);
  }
  var validated = this._validateResponse(responseData);
  if(typeof validated != "object"){
    if(typeof validated == "number"){
      err = this._makeError(validated);
    }
    return cb(err);
  }

  cb(null, validated);
};

var fnc = function(namespace, version, func) {
  return function(opts, cb){
    var self = this;
    if (!(self instanceof GoSquared)) self = new GoSquared(opts);
    if(typeof opts == 'function') {cb = opts; opts = {};}
    if(typeof opts != 'object') opts = {};
    if(typeof cb != 'function') cb = function(){};
    var endpoint = self.config.endpoints.api;
    opts.site_token = opts.site_token || self.opts.site_token;
    opts.api_key = opts.api_key || self.opts.api_key;
    self._exec(endpoint, '/' + namespace + '/'+ version + '/' + func, opts, self._responseCompleted.bind(self, cb));
  };
}

// set up the functions
var functions = config.api;
for (var namespace in functions) {

  var n = GoSquared[namespace];

  // ensure object exists
  if (!n) n = GoSquared[namespace] = {};

  for (var version in functions[namespace]) {
    if (version === 'def') continue;

    var v = n[version];

    // ensure version object exists
    if (!v) v = n[version] = {};

    var fncs = functions[namespace][version];

    for (var i = 0; i < fncs.length; i++) {
      var f = v[fncs[i]] = fnc(namespace, version, fncs[i]);

      // is this the default version?
      if (version === functions[namespace]['def']) {

        // set it on the namespace (e.g. $.GoSquared.now.concurrents)
        n[fncs[i]] = f;

        // set it on the root (e.g. $.GoSquared.concurrents)
        GoSquared[fncs[i]] = GoSquared.prototype[fncs[i]] = f;
      }

    }

  }
}
