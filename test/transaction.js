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

    t.track(th.testTrackError.bind(this, done));
  });

  it('items must have a name', function(){
    var t = GS.createTransaction(th.genTransactionID());

    t.addItem({
      price: 1.99,
      quantity: 1
    });

    t.items.length.should.equal(0);
  });

  it('tracks successfully with transaction ID as option', function(done){
    var tid = '' + th.genTransactionID();
    var t = GS.createTransaction({ id: tid });

    t.addItem('node-gosquared-test', {
      price: 1.99,
      quantity: 1
    });

    t.id.should.equal(tid);

    t.track(done);
  });

  it('coerces transaction ID to string', function(){
    var tid = th.genTransactionID();
    var t = GS.createTransaction(tid);

    t.id.should.equal('' + tid);
  });

  it('tracks successfully with name as arg', function(done){
    var name = 'node-gosquared-test';
    var t = GS.createTransaction(th.genTransactionID());

    t.addItem(name, {
      price: 1.99,
      quantity: 1
    });

    t.items[0].name.should.equal(name);

    t.track(done);
  });

  it('tracks successfully with name as prop', function(done){
    var name = 'node-gosquared-test';
    var t = GS.createTransaction(th.genTransactionID());

    t.addItem({
      name: name,
      price: 1.99,
      quantity: 1
    });

    t.items[0].name.should.equal(name);

    t.track(done);
  });

  it('tracks multiple items successfully', function(done){
    var t = GS.createTransaction(th.genTransactionID());

    t.addItems([
      {
        name: 'node-gosquared-test',
        price: 1.99,
        quantity: 1
      },
      {
        name: 'node-gosquared-test',
        price: 1.99,
        quantity: 1
      },
      {
        name: 'node-gosquared-test',
        price: 1.99,
        quantity: 1
      }
    ]);

    t.items.length.should.equal(3);

    t.track(done);
  });

  it('can override revenue and quantity', function(done){
    var t = GS.createTransaction(th.genTransactionID(), {
      revenue: 10,
      quantity:  5
    });

    t.addItem({
      name: 'node-gosquared-test',
      price: 1.99,
      quantity: 1
    });

    t.track(done);
  });

  it('can include additional customer attributes', function(done){
    var t = GS.createTransaction(th.genTransactionID(), {
      ua: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36',
      ip: '8.8.8.8',
      la: 'en-gb',
      ru: 'http://www.gosquared.com/ecommerce/'
    });

    t.addItem({
      name: 'node-gosquared-test',
      price: 1.99,
      quantity: 1
    });

    t.track(done);
  });
});
