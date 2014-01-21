var GoSquared = require('../lib/GoSquared');
var should = require('should');
var config = require('../config');
var th = require('../lib/testHelpers');

var GS;
var SITE_TOKEN = process.env.site_token;
var API_KEY = process.env.api_key;

before(function(){
  should.exist(SITE_TOKEN);
  should.exist(API_KEY);
  GS = new GoSquared({
    site_token: SITE_TOKEN,
    api_key: API_KEY,
    debugLevel: process.env.verbosity
  });
});

describe('API functions', function(){
  for (var namespace in config.api) {
    var n = config.api[namespace];
    for (var version in n) {
      if (version === 'def') continue;

      var v = n[version];
      for (var i = 0; i < v.length; i++) {
        var func = v[i];
        it('/' + namespace + '/' + version + '/' + func, function(namespace, version, func, done) {
          GS[namespace][version][func](th.testResponse.bind(this, done));
        }.bind(this, namespace, version, func));
      }
    }
  }
});
