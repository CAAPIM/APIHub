export DEPLOY_ENV ?= dev

.PHONY: build help

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


#### Install ####

install: package.json ## Install dependencies
	@yarn

copy-config-example: ## Copy config of the example. Usage DEPLOY_ENV=[dev|integration|layer7] make copy-config-example.
	cp packages/example/config/config-${DEPLOY_ENV}.js packages/example/public/config.js

copy-config-healthcare: ## Copy config of the healthcare. Usage DEPLOY_ENV=[dev|integration|layer7] make copy-config-healthcare.
	cp packages/healthcare/config/config-${DEPLOY_ENV}.js packages/healthcare/public/config.js

generate-mock-data: ## Generate new data for the mock server. Usage OUTPUT_FILE=my-file.json make generate-mock-data. OUTPUT_FILE is optionnal.
	./packages/layer7-apihub-mock/bin/generateData.js ${OUTPUT_FILE}

#### Build ####

build: ## Build the library
	@yarn build

build-example: ## Build the example
	@yarn build-example

build-healthcare: ## Build the healthcare
	@yarn build-healthcare


#### Run ####

start: copy-config-example build ## Starts the application in development mode
	@yarn start-example

start-healthcare: copy-config-healthcare build ## Starts the application in development mode
	@yarn start-healthcare

watch-lib: ## Starts the library in development mode
	@yarn start-lib


#### Tests ####

test: test-unit test-e2e ## Runs the tests. Usage BROWSER=[chrome|firefox] make test.

test-unit: ## Runs the unit tests. Usage make test-unit.
	@yarn test

test-unit-coverage: ## Runs the unit tests with coverage report. Usage make test-unit-coverage.
	@yarn test:coverage

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

copy-deploy-config-healthcare: ## Copy config of the healthcare. Usage DEPLOY_ENV=[dev|integration|staging] make copy-deploy-config-healthcare.
	cp packages/healthcare/config/config-${DEPLOY_ENV}.js packages/healthcare/build/config.js

deploy-example: copy-deploy-config-example ## Deploy the example on AWS S3. Usage DEPLOY_ENV=[dev|integration|staging] make deploy-example.
	aws s3 rm s3://broadcom-apihub.marmelab.com/example --recursive
	aws s3 sync packages/example/build/ s3://broadcom-apihub.marmelab.com/example
	aws s3 cp packages/example/build/index.html s3://broadcom-apihub.marmelab.com/example/index.html --cache-control="max-age=120"
	aws cloudfront create-invalidation --distribution-id E1AOZQ3R1CQ7R6 --paths "/*"

deploy-healthcare: copy-deploy-config-healthcare ## Deploy the healthcare on AWS S3. Usage DEPLOY_ENV=[dev|integration|staging] make deploy-healthcare.
	aws s3 rm s3://broadcom-apihub.marmelab.com/healthcare --recursive
	aws s3 sync packages/healthcare/build/ s3://broadcom-apihub.marmelab.com/healthcare
	aws s3 cp packages/healthcare/build/index.html s3://broadcom-apihub.marmelab.com/healthcare/index.html --cache-control="max-age=120"
	aws cloudfront create-invalidation --distribution-id E2X6V50RZK09GM --paths "/*"

deploy: build build-example build-healthcare ## Deploy all on AWS S3. Usage DEPLOY_ENV=[dev|integration|staging] make deploy.
	make deploy-example
	make deploy-healthcare
