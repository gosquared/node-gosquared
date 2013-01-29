test: test-events test-api-functions

test-events:
	./node_modules/mocha/bin/mocha ./test/event.js

test-api-functions:
	./node_modules/mocha/bin/mocha ./test/apiFunctions.js

.PHONY: test-events