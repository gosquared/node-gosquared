var util = require('util');

var Transaction = module.exports = function(GS, transactionID, opts){
  this.GS = GS;
  this.id = transactionID;
  this.items = [];

  if (typeof transactionID === 'object') {
    opts = transactionID;
    this.id = transactionID.id;
  }

  if (typeof this.id === 'undefined') this.GS._debug(101, 'WARNING');
  else this.id = '' + this.id;

  if (typeof opts === 'object') this.opts = opts;
  else this.opts = {};
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

Transaction.prototype.track = function(done){
  var GS = this.GS;

  if(typeof done !== 'function'){
    done = function(){};
  }

  if (typeof this.id === 'undefined') return done('transactionID not given');

  var params = {
    name: "_transaction",
    d: JSON.stringify({
      id: this.id,
      i: this.items,
      d: this.opts
    })
  };
  params.a = GS.opts.site_token;
  GS._exec(GS.config.endpoints.data, '/event', params, GS._responseCompleted.bind(GS, done));
};
