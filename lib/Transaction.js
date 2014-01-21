var util = require('util');

var Transaction = module.exports = function(GS, transactionID){
  this.GS = GS;
  this.id = transactionID;
  this.items = [];
};

Transaction.prototype.addItem = function(item) {
  if (!item.name) return this.GS._debug(100, 'WARNING');

  this.items.push(item);
};

Transaction.prototype.addItems = function(items) {
  items = items || [];
  items.map(this.addItem.bind(this));
};

Transaction.prototype.record = function(done){
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
      reveue: this.revenue,
      quantity: this.quantity
    })
  };
  params.a = GS.opts.site_token;
  GS._exec(GS.config.endpoints.data, '/event', params, GS._responseCompleted.bind(GS, done));
};
