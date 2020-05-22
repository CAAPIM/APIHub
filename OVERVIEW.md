# Layer7 API Hub Overview

This overview includes information about the following:

- The react-admin framework, its application structure, and its main components.
- The Material-UI library and its integration in react-admin.
- Guidelines for developing a react-admin application.

## Overview of the React-Admin Framework

> This section provides an overview of the react-admin application structure, describes the key directories, and their content.

The Layer7 API Hub library is based on top of [react-admin](https://marmelab.com/react-admin). It's a frontend framework for building admin applications running in the browser, on top of REST/GraphQL APIs, using ES6, React, and Material Design. React-admin is open-sourced and maintained by [Marmelab](https://marmelab.com).

The best way to start with API Hub is to walk through [the react-admin tutorial](https://marmelab.com/react-admin/Tutorial.html). This tutorial is a 30-minute step-by-step walkthrough of how to build a react-admin application.

Useful links:

- [React-admin documentation](https://marmelab.com/react-admin/Readme.html): Contains documentation and tutorials to help you get started.
- [Open-source code on GitHub](https://github.com/marmelab/react-admin): To go deeper, you can read the code source. Everything is public.
- [Report issues on GitHub](https://github.com/marmelab/react-admin/issues): Report bugs in the react-admin repository.
- [React-admin community on StackOverflow](http://stackoverflow.com/questions/tagged/react-admin): Ask "How To" questions, get usage advice, or troubleshoot your own code.

The following sections are based on the [simple example](https://github.com/marmelab/react-admin/tree/master/examples/simple) in the react-admin repository.

### Application Structure

The following structure is a simplified version of the Simple example:

- /src
  - /posts
    - index.js
  - authProvider.js
  - dataProvider.js
  - i18nProvider.js.
  - index.js

#### ``The <Admin /> Component``

The ``<Admin />`` component contains the entire react-admin application:

``` js
// in index.js
import React from 'react';
import { render } from 'react-dom';
import { Admin, Resource } from 'react-admin';

import authProvider from './authProvider';
import dataProvider from './dataProvider';
import i18nProvider from './i18nProvider';
import posts from './posts';

render(
    <Admin dataProvider={dataProvider('http://localhost:3000')}>
        <Resource name="posts" {...posts} />
    </Admin>,
    document.getElementById('root')
);
```

### The ``<Resource />`` Component

The ``<Resource />`` component defines the components for each of the admin views: list, edit, and create. A single resource generally corresponds to a single API endpoint. Define only the components you need. You can have a list page without having an edit and a create page. You can also find a show page, which corresponds to a read-only view of the resource.

``` js
// in posts/index.js
import React from 'react';
import { List, Datagrid, Edit, Create, SimpleForm, DateField, TextField, EditButton, TextInput, DateInput } from 'react-admin';
import { Book as BookIcon } from '@material-ui/icons';

export const PostIcon = BookIcon;

export const PostList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <TextField source="average_note" />
            <TextField source="views" />
            <EditButton basePath="/posts" />
        </Datagrid>
    </List>
);

const PostTitle = ({ record }) => {
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
};

export const PostEdit = (props) => (
    <Edit title={<PostTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="title" />
            <TextInput source="teaser" options={{ multiLine: true }} />
            <TextInput multiline source="body" />
            <DateInput label="Publication date" source="published_at" />
            <TextInput source="average_note" />
            <TextInput disabled label="Nb views" source="views" />
        </SimpleForm>
    </Edit>
);

export const PostCreate = (props) => (
    <Create title="Create a Post" {...props}>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="teaser" options={{ multiLine: true }} />
            <TextInput multiline source="body" />
            <TextInput label="Publication date" source="published_at" />
            <TextInput source="average_note" />
        </SimpleForm>
    </Create>
);
```

### The Data Provider

The data provider is the link between react-admin and your API. It fetches the data from your API and transform it to match react-admin standards.

``` js
// dataProvider.js
import { fetchUtils } from 'ra-core';

export default apiUrl => {
    return {
        getOne: async (resource, params) => {
            const url = `${apiUrl}${resource}/${params.id}`;

            const {
                json: { uuid, ...data },
            } = await fetchUtils.fetchJson(url, { credentials: 'include' });

            // React-Admin needs an id instead of an uuid.
            // So the getOne method makes the transformation
            return {
                data: {
                    ...data,
                    id: uuid
                },
            };
        },

        // Define also other verbs:
        // - getList
        // - getMany
        // - getManyReference
        // - update
        // - updateMany
        // - create
        // - delete
        // - deleteMany
    };
};
```

The Layer 7 API Hub library provides a built-in data provider that works with the API Portal.

**Tip:** Consider using [the pre-built data providers](https://marmelab.com/react-admin/DataProviders.html#available-providers).

### The Authentication Provider

You can secure your admin app with the authentication strategy of your choice using react-admin:

``` js
// authProvider.js (simplified version)
export const authProvider = {
    login: ({ username, password }) => {
        if (username === 'Admin' && password === 'Password@1') {
            localStorage.setItem('authenticated', 'admin');
            return Promise.resolve();
        }
        return Promise.reject();
    },
    logout: params => {
        localStorage.removeItem('authenticated');
        return Promise.resolve();
    },
    checkAuth: params => {
        return localStorage.getItem('authenticated')
            ? Promise.resolve()
            : Promise.reject();
    },
    checkError: ({ status }) => {
        return status === 401 || status === 403
            ? Promise.reject()
            : Promise.resolve();
    },
    getPermissions: params => Promise.resolve(),
};
```

The Layer7 API Hub library provides a built-in authentication provider. Implement it if you have a special authentication strategy. For more information about how to implement the built-in authentication provider, see the [the react-admin Authentication Documentation](https://marmelab.com/react-admin/Authentication.html).

### The i18n Provider

The i18n provider is a dedicated built-in provider that manages the translations. It is based on [Polyglot.js](https://airbnb.io/polyglot.js/). The Layer7 API Hub library provides translations for English (default), Spanish, French, and Italian.

**Tip**: For support of other languages, see [the list of available locales](https://marmelab.com/react-admin/Translation.html#available-locales).

The i18n provider uses the following format:

``` js
export const i18nProvider = {
    translate: (key, options) => string,
    changeLocale: locale => Promise,
    getLocale: () => string,
}
```

The following is an example of the simplest way is to use this provider:

``` js
// i18nProvider.js
import { mergeTranslations } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import raEnglishMessages from 'ra-language-english';
import raFrenchMessages from 'ra-language-french';

import { englishMessages, frenchMessages } from './i18n';

export const i18nProvider = (defaultLocale = 'en') => {
    return polyglotI18nProvider(
        locale => {
            if (locale === 'en') {
                return englishMessages;
            }
            if (locale === 'fr') {
                return frenchMessages;
            }
        },
        defaultLocale
    );
};

export const englishMessages = mergeTranslations(raEnglishMessages, {
    // Put all your translations here, or override the existing ones
    // https://github.com/marmelab/react-admin/blob/master/packages/ra-language-english/src/index.ts
    resources: {
        posts: {
            name: 'Post |||| Posts',
        },
    },
});

export const frenchMessages = mergeTranslations(raFrenchMessages, {
    // Put all your translations here, or override the existing ones
    // https://github.com/marmelab/react-admin/blob/master/packages/ra-language-french/src/index.ts
    resources: {
        posts: {
            name: 'Article |||| Articles',
        },
    },
});
```

## The Material-UI Library

> This section provides an overview of the Material-UI library.

The react-admin front-end framework relies on [Material-UI](https://material-ui.com), a library of components. Material-UI is an implementation for React of the [material design](https://material.io/design). When designing interfaces in react-admin applications, we recommend that you reference the [the Material Design guidelines](https://material.io/design).

### Material-UI Components

React-admin uses Material-UI components internally. But sometimes you need to use these components directly. For example, when you are composing a custom interface.

For more information about how to use Material-UI, see [the Material-UI documentation](https://material-ui.com).

The following example builds a custom <Button /> that display a loader when saving:

``` js
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, CircularProgress } from '@material-ui/core';
import { Save as SaveIcon } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(1),
    },
    circularProgress: {
        color: theme.palette.grey[500],
    },
}));

export function CustomButton(props) {
    const {
        children,
        loading = 'false',
        variant = 'outlined',
        ...rest
    } = props;
    const classes = useStyles(rest);

    return (
        <Button
            className={classes.button}
            startIcon={
                loading ? (
                    <CircularProgress
                        className={classes.circularProgress}
                        size={15}
                    />
                ) : (
                    <SaveIcon />
                )
            }
            variant={variant}
            disable={loading}
        >
            {children}
        </Button>
    );
}
```

### Material-UI Icons

You can use the Material-UI icons as components, and you can customize them. For more information about these icons, see [the Material-UI library](https://material-ui.com/components/material-icons).

``` js
import { Save as SaveIcon } from '@material-ui/icons';

<SaveIcon />
```

### Theme

You can customize the [Material-UI theme](https://material-ui.com/customization/theming) by overriding the [default theme](https://material-ui.com/customization/default-theme).

In react-admin, pass the theme to the <Admin /> component:
``` js
// Admin.js
import { defaultTheme } from 'react-admin';
import { createMuiTheme } from '@material-ui/core/styles';
import defaultMuiTheme from '@material-ui/core/styles/defaultTheme';
import { blue } from '@material-ui/core/colors';

const theme = {
    ...defaultTheme,
    palette: {
        ...defaultTheme.palette,
        secondary: { // Override the secondary theme
            ...defaultTheme.palette.secondary,
            light: '#6ec6ff',
            main: '#43425D',
            dark: '#0069c0',
            contrastText: defaultMuiTheme.palette.common.white,
        },
    },
};

export function ApiHubAdmin() {
    return <Admin theme={createMuiTheme(theme)} />
}
```

## Guidelines for Developing a React-Admin Application

// TODO
