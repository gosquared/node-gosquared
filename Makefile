SITE_TOKEN ?= GSN-181546-E
API_KEY ?= demo
VERBOSITY ?= WARNING

test: test-events test-api-functions

test-events:
	siteToken=$(SITE_TOKEN) apiKey=$(API_KEY) verbosity=$(VERBOSITY) ./node_modules/mocha/bin/mocha ./test/event.js

test-api-functions:
	siteToken=$(SITE_TOKEN) apiKey=$(API_KEY) verbosity=$(VERBOSITY) ./node_modules/mocha/bin/mocha ./test/apiFunctions.js

.PHONY: test-events test-api-functions