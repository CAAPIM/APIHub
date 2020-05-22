# Layer7 API Hub Mock Server Package

This package provides an API Hub mock server that intercepts calls to the Portal API (PAPI) and sends back a generated response. This mock server runs in a web browser.

The mock server was built using Mirage JS. For more information, see [the Mirage JS site](https://miragejs.com).

## How to Use the Mock Server in your Application

Start a mock server in your client application by calling the `startApiHubMockedServer` function, for example:

```js
import { startApiHubMockedServer } from 'layer7-apihub-mock';

startApiHubMockedServer();
```

This function returns a promise.

The following example code is expanded to wait for the promise to be resolved before it renders the application:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { startApiHubMockedServer } from 'layer7-apihub-mock';

import App from './App';

startApiHubMockedServer().then(() =>
    ReactDOM.render(<App />, document.getElementById('root'))
);
```

If no data is available yet, this function initializes the local database.

### Access the Local Database

The mock server creates a global `Layer7Mock` object that you can use in your browser's Developer Tool console if you need to reset the local database:

``` js
Layer7Mock.database // Returns the data base
Layer7Mock.resetDatabase() // Delete then recreate the local database
Layer7Mock.clearDatabase() // Delete the local database
Layer7Mock.initDatabase() // Recreate the local database
```

### Running Indicator

By default, a running indicator will be displayed on the bottom left of each pages.

To disable it, you can pass the `showRunningIndicator` option when stating the API Hub mock server.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { startApiHubMockedServer } from 'layer7-apihub-mock';

import App from './App';

startApiHubMockedServer({ showRunningIndicator: false }).then(() =>
    ReactDOM.render(<App />, document.getElementById('root'))
);
```

## Available Users

The following user accounts are included with the mock server:

- A Portal Admin (username `portalAdmin` and password `Password@1`).
- An Org Publisher (username `orgPublisher` and password `Password@1`).
- An API Owner (username `apiOwner` and password `Password@1`).
- A developer user (username `user` and password `Password@1`).
You can change these users by providing your own data. See the section "Provide your own Data".

## Customize API Hub Mock Server

You can customize the API Hub mock server by adding API routes and entities. The `startApiHubMockedServer()` function returns an object that includes the following keys:
- `server`. This key is the MirageJS server instance. You can add API routes using this server instance.
- `database`. This key is a [minimongo](https://github.com/mWater/minimongo) instance. You can add entities using this instance. These entities are persisted in an IndexedDb database.

### Register API Routes

Register API routes by calling the appropriate methods on the server instance. The server instance includes an API route for every HTTP verb (`get`, `patch` `put`, `post`, `del` and `options`).

For more information about how to register API routes, see [the Mirage documentation](https://miragejs.com/docs/main-concepts/route-handlers/).

The following is example code that customizes the `get` verb for the `/me` endpoint:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { startApiHubMockedServer } from 'layer7-apihub-mock';

import App from './App';

startApiHubMockedServer().then(({ server }) => {
    server.get('/me', (schema, request) => {
        // Do something with the request
    });

    ReactDOM.render(<App />, document.getElementById('root'))
});
```

### Register Entities

Register the entities that you want added to and persisted in the IndexedDB database.

To add custom entities to the database for your customized API routes use `database.addCollection(entityName)`. The following code example expands on the previous code by adding the `custom-entity` entity to the database:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { startApiHubMockedServer } from 'layer7-apihub-mock';

import App from './App';

startApiHubMockedServer().then(({ server, database }) => {
    server.get('/me', (schema, request) => {
        // Do something with the request
    });

    database.addCollection('custom-entity');

    ReactDOM.render(<App />, document.getElementById('root'))
});
```

For more information about how to register entitites, see [minimongo](https://github.com/mWater/minimongo).

### Provide your own Data

The mock server includes default data. You can also provide your own data by passing the `data` object, for example:

```jsx
import data from './data';
import { startApiHubMockedServer } from 'layer7-apihub-mock';

startApiHubMockedServer({ data });
```

This object includes the following keys:

- `userContexts`. This key is an array of `Users` objects.
- `tags`. This key is an array of `ApiTag` objects.
- `apis`. This key is an array of `Apis` objects.
- `applications`. This key is an array of `Applications` objects.
- `documents`. This key is an array of `Document` objects.
- `assets`. This key is an array of `apiAsset` objects.

For more information about these PAPI objects, see [Layer7 API Developer Portal documentation](http://techdocs.broadcom.com/apiportal).

### Generate New Data

To generate new data, you have to run the following command which accepts an output file:

``` sh
./bin/generateData.js myOutputFile.json
```

If you don't pass an output file, it will override the default data `defaultData.json`.
