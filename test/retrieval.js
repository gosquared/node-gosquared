var utils = require('./utils');
var config = require('../config');
var async = require('async');
var opts = require('./opts');
var GoSquared = require('../lib/GoSquared');
var gosquared = new GoSquared(opts);

var testSuccess = utils.testSuccess;
var testFail = utils.testFail;

var api = {
  now: require('../lib/api/Now').api,
  ecommerce: require('../lib/api/Ecommerce').api,
  trends: require('../lib/api/Trends').api,
};

describe('API functions', function(){
  it('retrieves data', function(done) {
    var reqs = [];
    for (var namespace in api) {
      var n = api[namespace];
      for (var version in n) {
        if (version === 'latest') continue;

        var v = n[version];
        for (var i = 0; i < v.length; i++) {
          var func = v[i];
          reqs.push(function(namespace, version, func, done) {
            gosquared[namespace][version][func](testSuccess(done));
          }.bind(this, namespace, version, func));
        }
      }
    }
    async.parallel(reqs, done);
  });
});
