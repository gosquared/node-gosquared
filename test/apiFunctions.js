var GoSquared = require('../lib/gosquared'),
    should = require('should'),
    config = require('../config'),
    th = require('../lib/testHelpers');

var GS,
    SITE_TOKEN = process.env.siteToken,
    API_KEY = process.env.apiKey;

before(function(){
  should.exist(SITE_TOKEN);
  should.exist(API_KEY);
  GS = new GoSquared({
    siteToken: SITE_TOKEN,
    apiKey: API_KEY,
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