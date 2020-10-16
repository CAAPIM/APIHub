# Layer7 API Hub Mock Server Package

This package provides an API Hub mock server that intercepts calls to the Portal API (PAPI) and sends back a generated response. This mock server runs in a web browser.

The mock server was built using Mirage JS. For more information, see [the Mirage JS site](https://miragejs.com).

## Start the Mock Server in your Client Application

Call the `startApiHubMockedServer` function, for example:

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

### Access the Local Database

The mock server creates a global `Layer7Mock` object. You can access the local database using this object in your browser's Developer Tool console:

``` js
Layer7Mock.database // Returns the data base
Layer7Mock.resetDatabase() // Delete then recreate the local database
Layer7Mock.clearDatabase() // Delete the local database
Layer7Mock.initDatabase() // Recreate the local database
```

The `resetDatabase()`, `clearDatabase()`, `initDatabase()` functions return promises. They also log messages indicating they finished their job. Wait for these messages before refreshing the page or before performing actions in your application.

You can load alternate data than the data that the mock server includes by default using the `resetDatabase()` and `initDatabase()` functions.
For more information about the format for the `data` object, see [Provide your own Data](#provide-your-own-data).

### Disable the Running Indicator

By default, a running indicator is displayed on the bottom left of each page. To disable it, pass the `showRunningIndicator` option when starting the mock server:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { startApiHubMockedServer } from 'layer7-apihub-mock';

import App from './App';

startApiHubMockedServer({ showRunningIndicator: false }).then(() =>
    ReactDOM.render(<App />, document.getElementById('root'))
);
```

## Available User Roles

The following user roles are included with the mock server:

- Portal Admin
    - login: `portalAdmin`
    - password: `Password@1`
    
- API Owner
    - login: `apiOwner`
    - password: `Password@1`
    
 - Org Publisher
    - login: `orgPublisher`
    - password: `Password@1`
    
 - Org Admin
    - login: `Publisher`
    - password: `Password@1`
    
 - Developer
    - login: `user`
    - password: `Password@1`

You can change these user roles by [providing your own Data](#provide-your-own-data).

## Customize the Mock Server

You can customize the mock server by adding API routes and entities. The `startApiHubMockedServer()` function returns an object that includes the following keys:
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

Register the entities that you want added to and persisted in the IndexedDB database. To add custom entities to the database for your customized API routes, use `database.addCollection(entityName)`.

The following code example expands on the previous code by adding the `custom-entity` entity to the database:

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

### Provide your Own Data

The mock server includes default data. You can also provide your own data by passing the `data` object, for example:

```jsx
import data from './data';
import { startApiHubMockedServer } from 'layer7-apihub-mock';

startApiHubMockedServer({ data });
```

This object includes the following keys:

- `userContexts`. This key is an array of `Users` PAPI objects.
- `tags`. This key is an array of `ApiTag` PAPI objects.
- `apis`. This key is an array of `Apis` PAPI objects.
- `applications`. This key is an array of `Applications` PAPI objects.
- `documents`. This key is an array of `Document` PAPI objects.
- `assets`. This key is an array of `apiAsset` PAPI objects.

For more information about these PAPI objects, see [the Layer7 API Developer Portal documentation](http://techdocs.broadcom.com/apiportal).

### Generate New Data

To generate new data, run the following command which accepts an output file:

``` sh
./bin/generateData.js myOutputFile.json
```

If you do not pass an output file, the command overrides the default data `defaultData.json`.
