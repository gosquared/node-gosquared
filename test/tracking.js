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
  describe('#identify', function() {
    it('works', function(done) {
      var p = gosquared.createPerson();
      var props = {
        id: 'test-node-gosquared',
        name: 'Node GoSquared',
        email: 'test-node@gosquared.com',
        custom: {
          test_node_gosquared: 'identify'
        }
      };
      p.identify(props, testSuccess(done));
    });

    it('works with an email', function(done) {
      var p = gosquared.createPerson();
      var props = {
        name: 'Node GoSquared',
        email: 'test-node@gosquared.com',
        custom: {
          test_node_gosquared: 'identify'
        }
      };
      p.identify(props, testSuccess(done));
    });

    it('fails without an id and email', function(done) {
      var p = gosquared.createPerson();
      var props = {
        name: 'Node GoSquared',
        custom: {
          test_node_gosquared: 'identify'
        }
      };
      p.identify(props, testFail(done));
    });
  });

  describe('#setProperties', function() {
    it('works', function(done) {
      var p = gosquared.createPerson();
      var props = {
        id: 'test-node-gosquared',
        custom: {
          test_node_gosquared: 'props'
        }
      };
      p.setProperties(props, testSuccess(done));
    });

    it('works with an anonymousID', function(done) {
      var p = gosquared.createPerson();
      p.anonymousID = 'test';
      var props = {
        custom: {
          test_node_gosquared: 'props'
        }
      };
      p.setProperties(props, testSuccess(done));
    });

    it('doesn\'t work without an ID', function(done) {
      var p = gosquared.createPerson();
      var props = {
        custom: {
          test_node_gosquared: 'props'
        }
      };
      p.setProperties(props, testFail(done));
    });
  });

  describe('#trackEvent', function() {
    it('works', function(done) {
      var p = gosquared.createPerson('test-node-gosquared');
      p.trackEvent('test_node_gosquared_event', testSuccess(done));
    });

    it('doesn\'t work without an ID', function(done) {
      var p = gosquared.createPerson();
      p.trackEvent('test_node_gosquared_event', testFail(done));
    });
  });

  describe('#createTransaction', function(done) {
    it('works', function(done) {
      var p = gosquared.createPerson('test-node-gosquared');
      var t = p.createTransaction(utils.makeTransactionID());
      t.track(testSuccess(done));
    });
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

  it('can include additional attributes', function(done){
    var t = gosquared.createTransaction(utils.makeTransactionID(), {
      revenue: '$5.99'
    });

    t.addItem({
      name: 'test-node-gosquared',
      price: 1.99,
      quantity: 1
    });

    t.track(testSuccess(done));
  });
});
