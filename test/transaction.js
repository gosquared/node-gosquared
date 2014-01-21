var GoSquared = require('../lib/GoSquared');
var should = require('should');
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

describe('Transaction', function(){
  it('cannot be stored without an ID', function(done){
    var t = GS.createTransaction();
    t.record(th.testTrackError.bind(this, done));
  });

  it('items must have a name', function(){
    var t = GS.createTransaction(12345678);
    t.addItem({
      price: 1.99,
      quantity: 1
    });

    t.items.length.should.equal(0);
  });

  it('records successfully', function(done){
    var t = GS.createTransaction(12345678);
    t.addItem({
      name: 'node-gosquared test',
      price: 1.99,
      quantity: 1
    });

    t.record(done);
  });

  it('can override revenue and quantity', function(done){
    var t = GS.createTransaction(12345678);
    t.addItem({
      name: 'node-gosquared test',
      price: 1.99,
      quantity: 1
    });

    t.revenue = 10;
    t.quantity = 5;

    t.record(done);
  });
});
