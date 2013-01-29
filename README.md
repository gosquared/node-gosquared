# node-gosquared

This node module works with the [GoSquared API][api-docs], making it really easy to integrate GoSquared with your node app.

It can be used as an easy proxy for frontend JavaScript so you don't publically expose your API Key.

## Installation
```bash
npm install --save gosquared
```

## Usage

```javascript 
var gosquared = new GoSquared(opts);
```

##### Options

* api_key: API key from your [account][casa]. Required for API functions, not required for tracking functions.
* site_token: Token for the registered site you're working with. Required.
* requestTimeout: Maximum time in ms an API request can be pending. Default 2000ms
* debugLevel: One of 'TRACE', 'NOTICE', 'WARNING', 'ALL'. Default 'WARNING'

### API
```javascript
var GoSquared = require('gosquared');

var gosquared = new GoSquared({
  api_key: 'demo',
  site_token: 'GSN-181546-E'
});

gosquared.concurrents(function(e,data) {
  if (e) return console.log(e);
  console.log(data)
});
```

All functions listed in the [API documentation][api-docs] are methods you can call on the ```gosquared``` object.


### Tracking

##### Events
Send events to GoSquared:

```javascript
gosquared.storeEvent('Test Event', {its: true, 'you can': 'store', any: 'event', properties: 'You Like' });
```


## Run tests
Install all dependencies using ```npm install``` then:

```bash
make test
```

Optionally, you can run the tests with a site token and API key of your choice:

```bash
SITE_TOKEN=<your token> API_KEY=<your api key> make test
```

[api-docs]: https://www.gosquared.com/developer/latest/
[casa]: https://www.gosquared.com/home/developer