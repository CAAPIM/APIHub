# Layer7 API Hub Library

## Add Pages

The new pages mechanism is based on React-Admin [custom routes](https://marmelab.com/react-admin/Admin.html#customroutes), and the [React Router](https://reacttraining.com/react-router/) library.

### In the Layer7 API Hub Library

Add the new pages to the ``<Admin />`` component (react-admin) using the `customRoutes` prop. The library includes the following custom pages:

- `/reset-password`
- `/new-password`
- `/account-setup`
- `/signup`

To add new ones, update the `ApiHubAdmin.js` file.

### In an Application using the Layer7 API Hub Library

Add the new pages to the ``<ApiHubAdmin />`` component using the `customRoutes` prop. For example, you can add a contact-us page.

**Simple usage:**

```js
import React from 'react';
import { Route } from 'react-router';
import { ApiHubAdmin } from 'layer7-apihub';

function MyCustomPage() {
    return <div>My Custom Page</div>
}

function MyCustomRoute() {
    return <Route
        path="/custom-page"
        component={MyCustomPage}
        noLayout // Do not use the layout from ApiHub
    />
}

export function CustomAdmin() {
    return <ApiHubAdmin customRoutes={[MyCustomRoute]} />
}
```
**Advanced usage:** See [the Example Application README](../../packages/example/README.md###how-to-add-a-new-page).

## Add Additional Language Support

### In the Layer7 API Hub Library

1. Add a dependency to the `react-admin package.json` file for the language.
Marmelab and the community have made translation files available. See [the react-admin documentation]<https://marmelab.com/react-admin/Translation.html#available-locales>.

2. Copy the `./packages/layer7-apihub/src/i18n/en.js` file and rename it with the new locale code. For example, `nl` for Dutch.

3. Modify the new file with the translation for each resource.

4. Update the `./src/i18n/index.js` file and the `./src/i18n/i18nProvider.js` file to make the new translations available to the app. The following example adds Dutch:

``` js
// in packages/layer7-apihub/src/i18n/i18nProvider.js
import dutchMessages from './nl';

export const i18nProvider = (defaultLocale = 'en') => {
    return polyglotI18nProvider(
        locale => {
            // ... Other locales...
            if (locale === 'nl') {
                return dutchMessages;
            }
        },
        defaultLocale
    );
};
```

``` js
// in packages/layer7-apihub/src/i18n/index.js
import nl from './nl';

export const dutchMessages = nl;
```

5. Update the `./src/i18n/supportedLocales.js` file with the the new locale. The locale selectors use this file in the application to display the list of available languages in the Example app.

### In an Application using the Layer7 API Hub Library
// Todo

## How to Catch and Display PAPI Errors

// Todo
