var URL = require('url'),
    h = require('./lib/helpers');

var endpoints = {
  data: {
    protocol: 'https:',
    hostname: 'data.gosquared.com',
    port: 443,
    method: 'POST'
  },

  api: {
    protocol: 'https:',
    hostname: 'api.gosquared.com',
    port: 443,
    method: 'GET'
  }
};

Object.keys(endpoints).forEach(function(l){
  var url;
  if((url = process.env[l+'Endpoint'])){
    var pUrl = URL.parse(url);
    if(!pUrl) return;
    h.extend(endpoints[l], pUrl);
  }
});

module.exports = {
  endpoints: endpoints,

  gsEvent: {
    route: '/event'
  },

  api: {
    functions: [
      "aggregateStats",
      "campaigns",
      "concurrents",
      "engagement",
      "functions",
      "geo",
      "ignoredVisitors",
      "organics",
      "overview",
      "pages",
      "referrers",
      "reportPreferences",
      "sites",
      "time",
      "timeSeries",
      "visitors"
      ]
  }
};