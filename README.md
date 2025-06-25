# Layer7 API Hub

**Prerequisite:** You have read the [Layer7 API Hub Overview](./OVERVIEW.md).

## Packages Directory

> This section provides an overview of the react-admin application structure, describes the key directories, and the content of these directories. The packages directory includes the following libraries and apps.

### Layer7 API Hub Library

[The Layer7 API Hub library README](./packages/layer7-apihub/README.md) includes the following information:

- [Add pages](./packages/layer7-apihub/README.md##add-a-pages)
- [Add additional language support](./packages/layer7-apihub/README.md##add-additional-language-support)

### Example App

The Example app has the same source code as the standard API Hub. [The Example app README](./packages/example/README.md) includes the following information:

- [Configure the Example app](./packages/example/README.md##configure-the-example-app)
- [Change the page title](./packages/example/README.md##change-the-page-title)
- [Make calls to the Layer7 API Hub Mock Server or Portal API (PAPI)](./packages/example/README.md##make-calls-to-the-layer7-api-hub-mock-server-or-portal-api-papi)
- [Host the Example app on another domain](./packages/example/README.md##host-the-example-app-on-another-domain)
- [Auto-detect the API Hub URL](./packages/example/README.md##auto-detect-the-api-hub-url)
- [Customization Tutorials](./packages/example/README.md##customization-tutorials)


## Quick Start

Use the following commands to set up you local development environment.

**Prerequisites:**

Before setting up your local development environment, ensure that you have completed the following:

- You have installed [Yarn](https://yarnpkg.com/).
- You have installed GNU Make 3.81 or later.
- You have installed Node v22.13.0.

### Install the JavaScript Dependencies

Install the JavaScript dependencies by issuing the following command:

```sh
make install
```

### Start an App

Start the Example app or the Healthcare app in watch mode.

To start the **Example app**, issue the following command:

```sh
make start
```

### Run the Tests

Run the unit tests and the E2E tests by issuing the following command:

```
make test
```

#### Unit Tests

Run only the unit tests by issuing the following command:

```sh
make test-unit
```

## Deploy the Example App

Build the API Hub library, the Example app, and then copy the production configuration by issuing the following commands:

```sh
make build
make build-example
DEPLOY_ENV=prod make copy-deploy-config-example
```

Copy the contents of the `packages/example/build` directory to your favorite web hosting service. For example, the following command launches an nginx Docker container on your local machine:

```sh
docker run --name APIHub -v `pwd`/packages/example/build:/usr/share/nginx/html:ro -p 8888:80 nginx
```

## Create an API Hub Implementation

Follow these steps:

1. From the root of this repository, initialize a new react-app called `my-own-apihub` by issuing the following commands:

```sh
$ cd packages && yarn create react-app my-own-apihub --scripts-version=3.2.0 
```

2. Add the `layer7-aphub`, `layer7-apihub-mock`, and `react-admin` packages as dependencies in the new package.json:

```
  # in packages/my-own-apihub/package.json
 "dependencies": {
        "layer7-apihub": "~1.0.0",
        "react": "^18.3.1",
        "react-dom": "^18.3.1",
        "react-admin": "^5.7.3",
        "react-helmet": "~6.1.0",
        "tss-react": "~4.9.4"
    },
```

3. Copy the config files to the `example` package by issuing the following commands:

```sh
$ cp -r packages/example/config packages/my-own-apihub/config/
$ cp packages/my-own-apihub/config/config-dev.js packages/my-own-apihub/public/config.js
```

4. Update the public `index.html` file to include the `config.js` file:

```html
<!-- in packages/my-own-apihub/public/index.html -->
<head>
...
  <script type="text/javascript" src="%PUBLIC_URL%/config.js"></script>
... 
 </head>
```

5. Include the base API Hub component in the `App.js` file:

```js
// in packages/my-own-apihub/src/App.js
import { ApiHubAdmin } from 'layer7-apihub';
const App = () => {
    const { APIHUB_URL, TENANT_NAME, ORIGIN_HUB_NAME } = global.APIHUB_CONFIG;
    return (
        <ApiHubAdmin
            url={APIHUB_URL} 
            tenantName={TENANT_NAME}
            originHubName={ORIGIN_HUB_NAME}
        />
    );
};
```

6. Start the bare-bones my-own-apihub app by issuing the following commands:

```
$ cd packages/my-own-apihub
$ yarn install
$ yarn start
```
