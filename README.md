# node-gosquared

The official GoSquared Node.js module for integrating the [GoSquared API](docs) into your Node.JS app with ease.

## Installation

```bash
npm install --save gosquared
```

## Usage

### Tracking API

See the [Tracking API][tracking-docs] docs site for full documentation.

### Reporting API

```javascript
var GoSquared = require('gosquared');

var gosquared = new GoSquared({
  api_key: 'demo',
  site_token: 'GSN-181546-E'
});
```

Methods mirror the structure of the GoSquared API:

```javascript
gosquared[namespace][version][function]
```

Consult the [Reporting API Docs][reporting-docs] for available namespaces, versions, and functions.

**Example**: We want to get the total number of visitors online on the site right now. For this, we need to use the `concurrents` function under the `v3` version of the `now` namespace:

```javascript
var GoSquared = require('gosquared');

var gosquared = new GoSquared({
  api_key: 'demo',
  site_token: 'GSN-181546-E'
});

gosquared.now.v3.concurrents(function(e,data) {
  if (e) return console.log(e);
  console.log(data)
});
```

All functions listed in the [Reporting API][reporting-docs] documentation are methods you can call on the ```gosquared``` object. The documentation also demonstrates the response data you can expect to get back.

## Run tests

Install test dependencies using ```npm install``` then:

```bash
SITE_TOKEN=<your site token> API_KEY=<your api key> npm test-tracking
SITE_TOKEN=<your site token> API_KEY=<your api key> npm test-retrieval
```

[reporting-docs]: https://gosquared.com/developer/api/
[tracking-docs]: https://beta.gosquared.com/docs/tracking/api/
[docs]: https://beta.gosquared.com/docs
