var utils = require('./utils');
var config = require('../config');

var Transaction = module.exports = function(GS, transactionID, opts, trackingData){
  this.GS = GS;
  this.id = transactionID;
  this.items = [];

  if (transactionID && typeof transactionID === 'object') {
    opts = transactionID;
    this.id = transactionID.id;
  }

  this.opts = opts || {};
  this.trackingData = trackingData || {}
};

Transaction.prototype.addItem = function(itemName, itemOpts) {
  itemOpts = itemOpts || (typeof itemName === 'object' ? itemName : {});
  if (typeof itemName !== 'object' && typeof itemName !== 'undefined') itemOpts.name = itemName + '';

  this.items.push(itemOpts);
};

Transaction.prototype.addItems = function(items) {
  items = items || [];
  for(var i = 0; i < items.length;){
    this.addItem(items[i++]);
  }
};

Transaction.prototype.track = function(cb){
  var GS = this.GS;

  if (typeof cb !== 'function'){
    cb = function(){};
  }

  if (typeof this.id === 'undefined') {
    var err = new Error('Transaction ID not given');
    err.transaction = this;
    return cb(err);
  }

  for (var i = 0; i < this.items.length; i++) {
    var it = this.items[i];
    if (!it.name) {
      var err = new Error('Item name not given');
      err.item = it;
      err.transaction = this;
      return cb(err);
    }
  }



  var body = this.trackingData;
  body.transaction = {
    id: this.id,
    items: this.items,
    opts: this.opts
  };

  GS._exec(config.endpoint + '/tracking/v1', '/transaction', 'POST', {}, body, cb);
};
