export DEPLOY_ENV ?= dev

.PHONY: build help

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


#### Install ####

install: package.json ## Install dependencies
	@yarn

copy-config-example: ## Copy config of the example. Usage DEPLOY_ENV=[dev|integration|staging] make copy-config-example.
	cp packages/example/config/config-${DEPLOY_ENV}.js packages/example/public/config.js

generate-mock-data: ## Generate new data for the mock server. Usage OUTPUT_FILE=my-file.json make generate-mock-data. OUTPUT_FILE is optionnal.
	./packages/layer7-apihub-mock/bin/generateData.js ${OUTPUT_FILE}

#### Build ####

build: ## Build the library
	@yarn build

build-example: ## Build the example
	@yarn build-example

build-storybook: ## Build the storybook
	@yarn build-storybook


#### Run ####

start: copy-config-example build ## Starts the application in development mode
	@yarn start-example

watch-lib: ## Starts the library in development mode
	@yarn start-lib

storybook: ## Starts storybook
	@yarn storybook

#### Tests ####

test: test-unit test-e2e ## Runs the tests. Usage BROWSER=[chrome|firefox] make test.

test-unit: ## Runs the unit tests. Usage make test-unit.
	@yarn test

test-e2e: copy-config-example build build-example ## Runs the end-to-end tests. Usage BROWSER=[chrome|firefox] make test-e2e.
	@NODE_ENV=test cd cypress && yarn -s start

test-e2e-local: ## Opens the end-to-end tests GUI. Usage make test-e2e-local.
	@echo 'Starting e2e tests environment. Ensure you started the example first (make start)'.
	@cd cypress && yarn -s start-gui

#### Code Formatting ####

lint: ## Runs linting tools
	@yarn lint


#### Deployment ####

copy-deploy-config-example: ## Copy config of the example. Usage DEPLOY_ENV=[dev|integration|staging] make copy-deploy-config-example.
	cp packages/example/config/config-${DEPLOY_ENV}.js packages/example/build/config.js
