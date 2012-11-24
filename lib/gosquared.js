var request = require('request');

/*
See https://www.gosquared.com/developer for API documentation.
*/
var gosquared = function(defaults) {
  this.opts = defaults;
  this._setup();
};

gosquared.prototype._setup = function() {
  var standardFunctions = ["aggregateStats","alertPreferences","campaigns","concurrents","engagement","events","expandUrl","fullDump","functions","geo","ignoredVisitors","notifications","organics","overview","pages","referrers","reportPreferences","sites","time","timeSeries","trends","visitors"];
  for (var i = 0; i< standardFunctions.length; i++) {
    gosquared.prototype[standardFunctions[i]] = this._defaultFunction.bind(this,standardFunctions[i]);
  }
};

gosquared.prototype._defaultFunction = function(fctn,opts,cb) {
  if(typeof opts == 'function') {cb = opts; opts = {};}
  opts = this._parse(opts,['site_token','api_key']);
  console.log(opts);
  this._get(fctn, opts, cb);
};

// helper function to set default parameters
gosquared.prototype._parse = function(opts,set,cb) {
  for (var i = 0; i < set.length; i++) {
    if (!opts[set[i]]) {
      opts[set[i]] = this.opts[set[i]];
    }
  }
  return opts;
};

// actually gets the data
gosquared.prototype._get = function(fctn, params, cb) {
  request({
    url: 'https://api.gosquared.com/v2/'+fctn,
    qs: params,
    json: true
  }, function(e,r,body) {
    if (r.statusCode !== 200) {
      // we've had an error, send the body back as the error
      return cb(body);
    }
    cb(e,body);
  });
};

module.exports = function(opts) {
  return new gosquared(opts);
};