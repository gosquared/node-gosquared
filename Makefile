SITE_TOKEN ?= GSN-181546-E
API_KEY ?= demo
VERBOSITY ?= FATAL
RUNNER ?= ./node_modules/mocha/bin/mocha
REPORTER ?= list

run = site_token=$(SITE_TOKEN) \
	api_key=$(API_KEY) \
	verbosity=$(VERBOSITY) \
	dataEndpoint=$(DATA_ENDPOINT) \
	apiEndpoint=$(API_ENDPOINT) \
	$(RUNNER) -R $(REPORTER) $(1)

test: test-events test-api-functions

test-events:
	$(call run,./test/event.js)

test-api-functions:
	$(call run,./test/apiFunctions.js)

.PHONY: test-events test-api-functions
