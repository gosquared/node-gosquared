var GoSquared = require('../lib/gosquared'),
    should = require('should'),
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

describe('Events', function(){
  it('cannot be stored without a name', function(done){
    GS.storeEvent(null, th.testError.bind(this, done));
  });

  it('can be stored without parameters', function(done){
    GS.storeEvent('Test Event', th.testResponse.bind(this, done));
  });

  it('can be stored with parameters', function(done){
    var params = {
      some: 'test',
      parameters: 'which',
      are: 'really',
      cool: true
    };
    GS.storeEvent('Test Event', params, th.testResponse.bind(this, done));
  });

  it('errors if trying to store a mahoosive parameters object', function(done){
    var params = {};
    var gen = function(o, max){
      var oSize = Object.keys(o).length;
      if(oSize > max) return o;
      o[oSize] = new Array(~~(Math.random()*100)).join('-');
      return gen(o, max);
    };
    gen(params, 25);
    GS.storeEvent('Test Event', params, th.testError.bind(this, done));
  });
});