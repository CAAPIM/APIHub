# Layer7 API Hub

**Prerequisite:** You have read the [Layer7 API Hub Overview](./OVERVIEW.md).

## Packages Directory

> This section provides an overview of the react-admin application structure, describes the key directories, and their content. The packages directory includes the following libraries and apps.

### Layer7 API Hub Library

For more information about the Layer7 API Hub library, see [the README](./packages/layer7-apihub/README.md):

- [Add custom pages](./packages/layer7-apihub/README.md##add-a-pages)
- [Change the styles](./packages/layer7-apihub/README.md##how-to-change-the-styles)
- [Add additional language support](./packages/layer7-apihub/README.md##how-to-add-additional-language-support)
- [Catch and display PAPI errors](./packages/layer7-apihub/README.md##How-to-catch-and-display-papi-errors)

### Example App

The Example app has the same source code as the standard API Hub.

For more information about the Example app, see [the Example App README](./packages/example/README.md):

- [Change the configuration](./packages/example/README.md##change-the-configuration)
- [Change the page title](./packages/example/README.md##change-the-page-title)
- [Connect to Portal API (PAPI) or use the Layer7 API Hub mock server](./packages/example/README.md##connecting-to-portal-apis-or-using-the-mock-server)
- [Host the app on another domain](./packages/example/README.md##host-the-app-on-another-domain)
- [Enable HTTPS](./packages/example/README.md##enable-https)
- [Auto-detect the API Hub URL](./packages/example/README.md##auto-detect-the-api-hub-url)

### Layer7 API Hub Mock Server

For more information about the API Hub mock server, see [the Layer7 API Hub Mock Server Package README](./packages/layer7-apihub-mock/README.md):

- [Use the mock server in your application](./packages/layer7-apihub-mock/README.md##How-to-use-it-in-your-application)
- [Available users](./packages/layer7-apihub-mock/README.md##available-users)
- [Customize API Hub mock server](./packages/layer7-apihub-mock/README.md##customize-API-hub-mock-server)

### Cypress End-To-End Testing

For more information about end-to-end testing, see [the Cypress README](./cypress/README.md).

## Development

**Prerequisites:**

- You have installed [Yarn](https://yarnpkg.com/).
- You have installed Make.

**Tip:** You can install the dependencies by issuing the following command:

```sh
make install
```
## Start the Application

Start the application in watch mode by issuing the following command:

```sh
make start
```

## Run the Tests

Run the unit tests and the end-to-end (E2E) tests by issuing the following command:

``` sh
make test
```

### Unit Tests

Run only the unit tests by issuing the following command:

``` sh
make test-unit
```

### End-To-End Tests

The E2E tests are based on the Example app. For more information about this package, see [Example app](./packages/example).

**Prerequisite:** You have a running instance of the Example app at <https://localhost:3000>. For more information, see ([Host the Example app on another domain](./packages/example/README.md##host-the-app-on-another-domain)).

Run only the E2E tests:

``` sh
make test-e2e
```

Open the E2E tests GUI (useful for writing and debugging E2E tests):

``` sh
make test-e2e-local
```

## Deploy the Example API Hub

Build the Layer7 API Hub library, build the Example app, and copy the production configuration by issuing the following commands:

```sh
make build
make build-example
DEPLOY_ENV=prod make copy-deploy-config-example
```

Copy the contents of the `packages/example/build` directory to your favorite web hosting service. For example, the following command launches an nginx Docker container on your local machine:

```sh
docker run --name APIHub -v `pwd`/packages/example/build:/usr/share/nginx/html:ro -p 8888:80 nginx
```
