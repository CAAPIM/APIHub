# Layer7 API Hub Library

## Add Pages

You can add pages in the Layer7 API Hub library or in an application using the Layer7 API Hub library. The add pages mechanism is based on react-admin [custom routes](https://marmelab.com/react-admin/Admin.html#customroutes) and the [React Router library](https://reacttraining.com/react-router/).

### In the Layer7 API Hub Library

To add pages in the API Hub library, add them to the react-admin ``<Admin />`` component using the `customRoutes` prop. Update the `ApiHubAdmin.js` file. The API Hub library includes the following custom pages:

- `/reset-password`
- `/new-password`
- `/account-setup`
- `/signup`

### In an Application using the Layer7 API Hub Library

To add pages in an application using the API Hub library, add them to the ``<ApiHubAdmin />`` component using the `customRoutes` and `customRoutesNoLayout` prop. For more information about how to make this customization, see [the "Add a Page" customization tutorial in the Example app README](../../packages/example/README.md#add-a-page).

## Add Additional Language Support in the Layer7 API Hub Library

**Follow these steps:**

1. Add a dependency to the `react-admin package.json` file for the language. Marmelab and the community have made translation files available. See [the react-admin documentation]<https://marmelab.com/react-admin/Translation.html#available-locales>.

2. Copy the `./packages/layer7-apihub/src/i18n/en.js` file and rename it with the new locale code. For example, `nl` for Dutch.

3. Modify the new file with the translation for each resource.

4. Update the `./src/i18n/index.js` file and the `./src/i18n/i18nProvider.js` file to make the new translations available to the app. The following example adds the Dutch language:

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
