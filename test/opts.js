var GoSquared = require('../lib/GoSquared');
var opts = {
  site_token: process.env.SITE_TOKEN || 'GSN-106863-S',
  api_key: process.env.API_KEY || 'demo'
};

if (process.env.LOG) opts.log = function() {
  console.log(JSON.stringify(arguments, null, 2));
};

module.exports = opts;
