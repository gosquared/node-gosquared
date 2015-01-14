var setupFunctions = require('../setupFunctions');

var Ecommerce = module.exports = function(GS) {
  this.GS = GS;
  setupFunctions.call(this, 'ecommerce', api);
};

var api = {
  latest: 'v1',
  v1: [
    "aggregate",
    "browser",
    "category",
    "country",
    "language",
    "os",
    "product",
    "sources",
    "transaction"
  ]
};

Ecommerce.api = api;
