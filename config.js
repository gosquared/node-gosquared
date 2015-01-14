var url = require('url');
var utils = require('./lib/utils');

var endpoints = {
  api: {
    href: 'https://api.gosquared.com'
  }
};

Object.keys(endpoints).forEach(function(l){
  var href;
  if((href = process.env[l+'Endpoint'])){
    var pUrl = url.parse(href);
    if(!pUrl) return;
    utils.extend(endpoints[l], pUrl);
  }
});

module.exports = {
  endpoint: endpoints.api.href
};
