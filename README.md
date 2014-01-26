# node-gosquared

This lightweight, zero-dependency module allows you to integrate the [GoSquared API][api-docs] into your Node.JS app with ease.

Commonly, you'll use this module to retrieve analytics data collected by GoSquared, but it can also be used to manage accounts, store events, and record transactions for GoSquared Ecommerce.

It can also be used in a backend app to proxy requests from a frontend app to the GoSquared API so you don't publicly expose your API Key.

## Installation
```bash
npm install --save gosquared
```

## Usage

```javascript
var GoSquared = require('gosquared');
var gosquared = new GoSquared(opts);
```

##### Options

* api_key: API key from your [account][casa]. Required for API functions, not required for tracking functions.
* site_token: Token for the registered site you're working with. Required.
* requestTimeout: Maximum time in ms an API request can be pending. Default 2000ms
* debugLevel: One of 'NONE', TRACE', 'NOTICE', 'WARNING', 'ALL'. Default 'WARNING'

### API

Methods mirror the structure of the GoSquared API:

```javascript
gosquared[namespace][version][function]
```

Consult the [API Docs][api-docs] for available namespaces, versions, and functions.

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

All functions listed in the [API documentation][api-docs] are methods you can call on the ```gosquared``` object. The documentation also demonstrates the response data you can expect to get back.


### Recording data

The module can also be used to send data to GoSquared.

#### Transactions

To track a transaction:

```javascript
var transactionID = 123456789;
var t = gosquared.createTransaction(transationID);

// Make sure each item has a name
t.addItem('Beer', {
	price: 3.50,
	quantity: 1,
	category: 'Alcoholic Drinks'
});

// You can also add multiple items at once
t.addItems([
	{
		name: 'More Beer',
		price: 4.99,
		quantity: 2,
		category: 'Alcoholic Drinks'
	},
	{
		name: 'Limoncello',
		price: 17.99,
		quantity: 1,
		category: 'Liquor'
	}
]);

// Send off to GoSquared
t.track(function(){
	// Done
});

```

GoSquared automatically calculates the total revenue and quantity for each transaction by summing these values of each item. If you would like to override the total transaction revenue and quantity, you can set them as transaction options:

```javascript
// Override revenue and quantity amounts

var opts = {
	customRevenue: 10,
	customQuantity: 5
};

var t = gosquared.createTransaction(transactionID, opts);

t.track();
```

##### Including additional info

One of the features of GoSquared Ecommerce is the ability to attribute revenue and quantity amounts to aspects of the customer, such as their country, language, browser or referring source. Although GoSquared is not able to automatically detect these for backend-triggered events, you can pass in the values GoSquared needs for this functionality.

To do this, include any of the following in the transaction's options object:

```javascript
var userAgent = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36'; // The browser's user agent
var ip = '0.0.0.0'; // The cusomer's IP address. IPv4 or IPv6
var language = 'en-gb'; // The customer's ISO 639-1 language string
var referringURL = 'http://www.gosquared.com/ecommerce/'; // The referring URL of the customer's visit

var previousTransaction = {
	ts: Date.now() // The UNIX timestamp in ms of the customer's previous transaction, if any
};

var opts = {
	ua: userAgent,
	ip: ip,
	la: language,
	ru: referringURL,
	pt: previousTransaction
};

var t = gosquared.createTransaction(transactionID, opts);

```

#### Events

Send events to GoSquared:

```javascript
gosquared.event('Test Event', {
		its: true,
		'you can': 'store',
		any: 'event',
		properties: 'You Like'
	},
	function(e, res){
		if(e) return console.log(e);
		console.log(res);
	}
);
```

## Run tests
Install test dependencies using ```npm install``` then:

```bash
make test
```

Optionally, you can run the tests with a site token and API key of your choice:

```bash
SITE_TOKEN=<your token> API_KEY=<your api key> make test
```

[api-docs]: https://www.gosquared.com/developer/api/
[casa]: https://www.gosquared.com/home/developer
