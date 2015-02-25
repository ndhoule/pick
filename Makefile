SRCS = index.js
TESTS = test/index.js

GREP ?=.

node_modules: $(wildcard package.json node_modules/**/package.json)
	@npm install

test:
	@node_modules/.bin/mocha \
		--ui bdd \
		--reporter spec \
		--grep "$(GREP)" \
		$(TESTS)

.DEFAULT_GOAL = test
.PHONY: test
