var util = require('util');

var Transaction = module.exports = function(GS, transactionID, opts){
  this.GS = GS;
  this.id = transactionID;
  this.items = [];

  if (typeof transactionID === 'object') {
    opts = transactionID;
    this.id = transactionID.id;
  }

  if (typeof this.id === 'undefined') {
    this.GS._debug(101, 'WARNING');
  } else {
    this.id = '' + this.id;
  }

  if (typeof opts === 'object') {
    this.opts = opts;
  } else {
    this.opts = {};
  }
};

Transaction.prototype.addItem = function(itemName, itemOpts) {
  itemOpts = itemOpts || (typeof itemName === 'object' ? itemName : {});
  if(typeof itemName !== 'object' && typeof itemName !== 'undefined') itemOpts.name = '' + itemName;

  if (!itemOpts.name) return this.GS._debug(100, 'WARNING');

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

  if(typeof cb !== 'function'){
    cb = function(){};
  }

  if (typeof this.id === 'undefined') return cb('transactionID not given');

  var data = {
    id: this.id,
    items: this.items,
    opts: this.opts
  };

  GS._exec(GS.config.endpoints.data, '/' + GS.opts.site_token + '/transaction', {}, data, GS._responseCompleted.bind(GS, cb));
};
