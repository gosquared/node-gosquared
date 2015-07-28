# node-gosquared

[![Travis](https://api.travis-ci.org/gosquared/node-gosquared.svg)](https://travis-ci.org/gosquared/node-gosquared)
[![Dependencies](https://david-dm.org/gosquared/node-gosquared.svg)](https://david-dm.org/gosquared/node-gosquared)
[![Join the chat at https://gitter.im/gosquared/node-gosquared](https://img.shields.io/badge/gitter-join%20chat-blue.svg)](https://gitter.im/gosquared/node-gosquared)

[![NPM](https://nodei.co/npm/gosquared.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/gosquared)

The official GoSquared Node.js module for integrating the [GoSquared API][docs] into your Node.JS app with ease.

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
[tracking-docs]: https://gosquared.com/docs/tracking/api/
[docs]: https://gosquared.com/docs
