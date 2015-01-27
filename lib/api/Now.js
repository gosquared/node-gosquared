var setupFunctions = require('../setupFunctions');

var Now = module.exports = function(GS) {
  this.GS = GS;
  setupFunctions.call(this, 'now', api);
};

var api = {
  latest: 'v3',
  v3: [
    "aggregateStats",
    "campaigns",
    "concurrents",
    "engagement",
    "geo",
    "overview",
    "pages",
    "sources",
    "timeSeries",
    "visitors"
  ]
};

Now.api = api;
