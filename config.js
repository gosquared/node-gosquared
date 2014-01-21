var URL = require('url');
var h = require('./lib/helpers');

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
    'account': {
      'def': 'v1',
      'v1': [
        "alertPreferences",
        "ignoredVisitors",
        "reportPreferences",
        "sites"
      ]
    },
    'now': {
      'def': 'v3',
      'v3': [
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
    },
    'trends': {
      'def': 'v2',
      'v2': [
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
    }
  }
};
