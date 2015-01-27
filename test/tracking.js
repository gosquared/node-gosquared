var utils = require('./utils');
var assert = require('assert');
var opts = require('./opts');
var GoSquared = require('../lib/GoSquared');
var gosquared = new GoSquared(opts);

var testSuccess = function(cb) {
  return function(err, res) {
    if (err) return cb(err);
    assert(res.success);
    return cb(err, res);
  };
};
var testFail = utils.testFail;

describe('People', function() {
  it('identify', function(done) {
    var p = gosquared.createPerson();
    var props = {
      name: 'Node GoSquared',
      email: 'test-node@gosquared.com',
      custom: {
        test_node_gosquared: 'identify'
      }
    };
    p.identify('test-node-gosquared', props, testSuccess(done));
  });

  it('props', function(done) {
    var p = gosquared.createPerson('test-node-gosquared');
    var props = {
      custom: {
        test_node_gosquared: 'props'
      }
    };
    p.setProperties(props, testSuccess(done));
  });

  it('alias', function(done) {
    var p = gosquared.createPerson();
    p.identify('test-node-gosquared-pre-alias', {
      name: 'Node GoSquared Pre Alias'
    });
    p.alias('test-node-gosquared-alias', testSuccess(done));
  });

  it('event', function(done) {
    var p = gosquared.createPerson('test-node-gosquared');
    p.trackEvent('test_node_gosquared_event', testSuccess(done));
  });

  it('transaction', function(done) {
    var p = gosquared.createPerson('test-node-gosquared');
    var t = p.createTransaction(utils.makeTransactionID());
    t.track(testSuccess(done));
  });
});

describe('Events', function(){
  it('cannot be stored without a name', function(done){
    gosquared.trackEvent(null, testFail(done));
  });

  it('can be stored without data', function(done){
    gosquared.trackEvent('Node GoSquared Test Event', testSuccess(done));
  });

  it('can be stored with data', function(done){
    var data = {
      some: 'test',
      parameters: 'here'
    };
    gosquared.trackEvent('Node GoSquared Test Event', data, testSuccess(done));
  });
});

describe('Transaction', function(){
  it('cannot be stored without an ID', function(done){
    var t = gosquared.createTransaction();

    t.track(testFail(done));
  });

  it('items must have a name', function(done){
    var t = gosquared.createTransaction(utils.makeTransactionID());

    t.addItem({
      price: 1.99,
      quantity: 1
    });

    t.track(testFail(done));
  });

  it('tracks successfully with transaction ID as option', function(done){
    var tid = utils.makeTransactionID();
    var t = gosquared.createTransaction({ id: tid });

    t.addItem('test-node-gosquared', {
      price: 1.99,
      quantity: 1
    });

    assert.equal(t.id, tid);

    t.track(testSuccess(done));
  });

  it('tracks successfully with name as arg', function(done){
    var name = 'test-node-gosquared';
    var t = gosquared.createTransaction(utils.makeTransactionID());

    t.addItem(name, {
      price: 1.99,
      quantity: 1
    });

    assert.equal(t.items[0].name, name);

    t.track(testSuccess(done));
  });

  it('tracks successfully with name as prop', function(done){
    var name = 'test-node-gosquared';
    var t = gosquared.createTransaction(utils.makeTransactionID());

    t.addItem({
      name: name,
      price: 1.99,
      quantity: 1
    });

    assert.equal(t.items[0].name, name);

    t.track(testSuccess(done));
  });

  it('tracks multiple items successfully', function(done){
    var t = gosquared.createTransaction(utils.makeTransactionID());

    t.addItems([
      {
        name: 'test-node-gosquared',
        price: 1.99,
        quantity: 1
      },
      {
        name: 'test-node-gosquared2',
        price: 1.99,
        quantity: 1
      },
      {
        name: 'test-node-gosquared3',
        price: 1.99,
        quantity: 1
      }
    ]);

    assert.equal(t.items.length, 3);

    t.track(testSuccess(done));
  });

  it('can override revenue and quantity', function(done){
    var t = gosquared.createTransaction(utils.makeTransactionID(), {
      revenue: 10,
      quantity:  5
    });

    t.addItem({
      name: 'test-node-gosquared',
      price: 1.99,
      quantity: 1
    });

    t.track(testSuccess(done));
  });

  it('can include additional customer attributes', function(done){
    var t = gosquared.createTransaction(utils.makeTransactionID(), {
      ua: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36',
      ip: '8.8.8.8',
      la: 'en-gb',
      ru: 'http://www.gosquared.com/ecommerce/'
    });

    t.addItem({
      name: 'test-node-gosquared',
      price: 1.99,
      quantity: 1
    });

    t.track(testSuccess(done));
  });
});
