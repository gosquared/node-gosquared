var GoSquared = require('../lib/gosquared'),
    should = require('should'),
    config = require('../config');

var GS,
    SITE_TOKEN = process.env.SITE_TOKEN,
    API_KEY = process.env.API_KEY;

before(function(){
  should.exist(SITE_TOKEN);
  should.exist(API_KEY);
  GS = new GoSquared({
    siteToken: SITE_TOKEN,
    apiKey: API_KEY,
    debugLevel: 'ALL'
  });
});

describe('API functions', function(){
  config.api.functions.forEach(function(fName){
    it(fName, function(fName, done){
      GS[fName](done);
    }.bind(this, fName));
  });
});