var GoSquared = require('../lib/gosquared'),
    should = require('should');

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

describe('Events', function(){
  it('can be stored using storeEvent', function(done){
    GS.storeEvent('Test Event', done);
  });
});