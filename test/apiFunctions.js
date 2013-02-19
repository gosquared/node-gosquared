var GoSquared = require('../lib/gosquared'),
    should = require('should'),
    config = require('../config'),
    th = require('../lib/testHelpers');

var GS,
    SITE_TOKEN = process.env.site_token,
    API_KEY = process.env.api_key;

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
  config.api.functions.forEach(function(fName){
    it(fName, function(fName, done){
      GS[fName](th.testResponse.bind(this, done));
    }.bind(this, fName));
  });
});