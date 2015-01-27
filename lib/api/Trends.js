var setupFunctions = require('../setupFunctions');

var Trends = module.exports = function(GS) {
  this.GS = GS;
  setupFunctions.call(this, 'trends', api);
};

var api = {
  latest: 'v2',
  v2: [
    "aggregate",
    "browser",
    "country",
    "event",
    "language",
    "organisation",
    "os",
    "page",
    "path1",
    "screenDimensions",
    "sources"
  ]
};

Trends.api = api;
