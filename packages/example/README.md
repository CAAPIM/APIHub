# Example App

The Example app demonstrates the usage of the Layer7 API Hub library. For more information about the library, see [the Layer7 API Hub Library README](../layer7-apihub/README.md).

The Example app is built is using vite

## Configure the Example App

The Example app configuration is set with global variables that are stored in the `window.APIHUB_CONFIG` object. The config files are in the `./config` folder of the Example app. Each file corresponds to a different environment. For example, the `config-dev.js` file corresponds to the configuration of the `dev` environment.

When deploying the app, copy the corresponding config file for the enviroment into the `./public` folder. These files are not involved in the webpack build process of the Example app.

For more information about how to use the `public` folder, see [the Create React App documentation](https://create-react-app.dev/docs/using-the-public-folder).

### Define a Configuration for a New Environment

**Follow these steps:**

1. Create a file named `config-XXX.js` in the `./config` folder, where `XXX` is the new environment name.

The following is an example of the `config.js` file:

``` js
window.APIHUB_CONFIG = {
    PAGE_TITLE: 'Layer7 API Hub | Broadcom', // The html page title
    APIHUB_URL: 'https://apim.dev.ca.com', // The Portal API (PAPI) domain
    TENANT_NAME: 'apim', // The tenant name
    ORIGIN_HUB_NAME: 'APIHub-Default',  // The identifier of the API Hub
    ENABLE_MOCK: false, // Enable/disable the Layer7 API Hub mock server
    MOCK_SERVER_INDICATOR_LINK:  // A link opened when clicking on the mock server running indicator
        'https://github.com/CAAPIM/APIHub/blob/master/packages/layer7-apihub-mock/README.md',
    USE_BRANDING_THEME: false, // Use the branding theme from PAPI
    USE_BRANDING_ICONS: true, // Use the branding favicon from PAPI
};
```

The `ORIGIN_HUB_NAME` variable is sent to PAPI servers to identify your API Hub. The Portal Admin uses this value in the `APIHUB_SETTINGS` to enable remote hosting.

2. Prefix the `deploy` command during the deploy process with `DEPLOY_ENV=XXX make deploy`.

**Tip:** You can override the `window.APIHUB_CONFIG` object directly in JavaScript in the browser before loading the Example app.

### Enable HTTPS

**Follow these steps:**

1. Update the `.env` file to match your node environment (`.env.development` matches `NODE_ENV=development`, for example).
2. Change or add the following keys:

```sh
PORT=443
HTTPS=true
```

### Customize the Example App

## Change the Page Title

Change the page title using `react` and `react-helmet` in the [/src/App.js](./src/App.js) file.

**Follow these steps:**

1. Update the default title in the `[/public/index.html](./public/index.html)` index file. You can define the page title before the Example app renders the page.
2. Update the page title defined by the Example app directly in the `config.js` file. The title is stored under the `window.APIHUB_CONFIG.PAGE_TITLE` key. You can define a different title for each environment.
For more information, see [Change the configuration](./README.md#change-the-configuration).

### Use the PAPI

Use one of the following options to use the PAPI:

- Use react-admin resource hooks and components for APIs, applications, or documents.
- Use fetch directly.

#### Use react-admin Resource Hooks

Use react-admin resource [hooks](https://marmelab.com/react-admin/Actions.html#specialized-hooks) and components for APIs, applications, or documents.

#### Use fetch

Use [fetch](https://marmelab.com/react-admin/Actions.html#querying-the-api-with-fetch) directly. Include the required credentials and HTTP headers. Use the [getFetchJson wrapper](../layer7-apihub/src/fetchUtils.js) that is in API Hub, which includes the credentials and headers.

The following code is an example of a hook that fetches metrics from the PAPI. The `useLayer7Notify` hook wraps the react-admin `useNotify` hook and adds PAPI error parsing:

```js
import { getFetchJson, useApiHub, useLayer7Notify } from 'layer7-apihub';

export function useApiHitsMetrics({ startDate, endDate }) {
    const { urlWithTenant, originHubName } = useApiHub();
    const [data, setData] = useState();
    const notify = useLayer7Notify();
    const url = `${urlWithTenant}/analytics/metrics/v1/hits/apis/by-day?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;

    useEffect(() => {
        // Use to ensure we don't try to update the state on an unmounted
        // component
        let updateState = true;
        // Get the fetchJson function configured for our instance
        const fetchJson = getFetchJson(originHubName);

        const fetchData = () => {
            fetchJson(url)
                .then(({ json }) => {
                    // Don't update the state if the calling component has been unmounted
                    if (updateState && json.data) {
                        setData(json.data);
                    }
                }).catch(error => {
                    notify(error);
                });
        };

        fetchData();

        return () => {
            updateState = false;
        };
    }, [originHubName, urlWithTenant, url]);

    return data;
}
```

## Host the Example App on Another Domain

You can deploy and host your customized API Hub on your own domain in an upcoming release.

## Auto-detect the API Hub URL

API Hub attempts to detect the URL of your API by inspecting your application URL and extracting the first sub domain. For example, with the application URL `https://apim.dev.ca.com`:

- the tenant is `apim`,
- the PAPI endpoint is `https://apim.dev.ca.com/api/apim/service`
- the admin endpoint is `https://apim.dev.ca.com/admin`

However, you can also supply the tenant and the API URL yourself by providing the `url` and `tenantName` properties on the `<ApiHubAdmin>` component.

## Customization Tutorials

**Prerequisite:** You have read [the Layer7 API Hub Library README](../../packages/layer7-apihub/README.md).

### Add a Page

In this example, we add a custom contact-us form in a new page at this location `/#/contact-us`.

1. Create a contact-us form in the `ui` folder.

``` js
// in src/ui/ContactUs.js
import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export function ContactUs() {
    return (
        <Paper>
            <Typography variant="title">Contact Us</Typography>
            <form action="contact-us.php">
                <TextField label="First Name" name="first_name" variant="filled" />
                <TextField label="Last Name" name="last_name" variant="filled" />
                <TextField
                    label="Message"
                    name="message"
                    variant="filled"
                    multiline
                    rowsMax="4"
                />
                <Button type="submit" variant="contained">
                    Send
                </Button>
            </form>
        </Paper>
    );
}

// in src/ui/index.js
export * from './ContactUs'
```

2. Create custom routes to access the `contact-us` component:

```js
// in src/App.js
import React from 'react';
import { Route } from 'react-router-dom';
import { ApiHubAdmin } from 'layer7-apihub';
import { ContactUs } from './ui'; // Import the component you've just created

const customRoutes = () => [
    <Route
        path="/contact-us"
        element={<ContactUs />}
    />,
    <Route
        path="/contact-us-2"
        element={<ContactUs />}
    />,
]

const App = () => {
    return (
        <ApiHubAdmin
            customRoutes={customRoutes} 
            // OR
            customRoutesNoLayout={customRoutes} // removes react-admin layout component
        />
    );
}

export default App;
```

You can now access the custom route at URL `/#/contact-us` and `/#/contact-us-2`.
