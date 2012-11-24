# node-gosquared

This node module works with the [GoSquared API](https://www.gosquared.com/developer), making it really easy to integrate GoSquared with your node app.

It can be used as an easy proxy so you don't expose your API Key too.

## Usage
```javascript
var GoSquared = require('node-gosquared');

var gosquared = new GoSquared({
  api_key: 'demo',
  site_token: 'GSN-181546-E'
});

gosquared.concurrents(function(e,data) {
  if (e) return console.log(e);
  console.log(data)
});
```