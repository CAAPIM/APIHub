# Example App

The Example app demonstrates the usage of the Layer7 API Hub library. For more information about the library, see [the Layer7 API Hub Library README](../layer7-apihub/README.md).

The Example app is built on top of [Create React App (CRA)](https://create-react-app.dev/).

## Configure the Example App

The Example app configuration is set with global variables that are stored in the `window.APIHUB_CONFIG` object. The config files are in the `./config` folder of the Example app. Each file corresponds to a different environment. For example, the `config-dev.js` file corresponds to the configuration of the `dev` environment.

When deploying the app, copy the corresponding config file for the enviroment into the `./public` folder. These files are not involved in the webpack build process of the Example app.

For more information about how to use the `public` folder, see [the Create React App documentation]<https://create-react-app.dev/docs/using-the-public-folder)>.

**Define a Configuration for a New Environment**

**Follow these steps:**

1. Create a file named `config-XXX.js` in the `./config` folder, where `XXX` is the new environment name.
2. Prefix the `deploy` command during the deploy process with `DEPLOY_ENV=XXX make deploy`.

**Tip:** You can override the `window.APIHUB_CONFIG` object directly in JavaScript in the browser before loading the Example app.

The following is an example of `config.js` file:

``` js
window.APIHUB_CONFIG = {
    PAGE_TITLE: 'Layer7 API Hub | Broadcom', // The html page title
    APIHUB_URL: 'https://apim.dev.ca.com', // The PAPI domain
    TENANT_NAME: 'apim', // The tenant name
    ENABLE_MOCK: false, // Enable the Layer7 API Hub mock server
    USE_BRANDING_THEME: false, // Use the branding theme from PAPI
    USE_BRANDING_ICONS: true, // Use the branding favicon from PAPI
};
```

## Change the Page Title

Change the page title using `react` and `react-helmet` in the [/src/App.js](./src/App.js) file.

**Follow these steps:**

1. Update the default title in the `[/public/index.html](./public/index.html)` index file. You can define the page title before the Example app renders the page.
2. Update the page title defined by the Example app directly in the `config.js` file. The title is stored under the `window.APIHUB_CONFIG.PAGE_TITLE` key. You can define a different title for each environment.
For more information, see [Change the configuration](./README.md#change-the-configuration)).

## Use the Mock Server

You can customize your application, without connecting to API Portal, using the [Layer7 API Hub mock server](https://github.gwd.broadcom.net/ESD/APIHub/tree/develop/packages/layer7-apihub-mock). The mock server is enabled by default.

To enable or disable the mock server, set the `ENABLE_MOCK` variable to `true` in your configuration file. For more information about how to change the configuration file, see [Configure the Example app](./README.md#configure-the-example-app).

You can change the [available users](../layer7-apihub-mock/README.md##available-users) by [providing your own data](../layer7-apihub-mock/README.md###provide-your-own-data). You can also use the mock server in other environments.

## Host the Example App on Another Domain

You can deploy and host your customized API Hub on your own domain. This feature will be available in an upcoming release.

## Customization Tutorials

**Prerequisite:** You have read [the Layer7 API Hub Library README](../../packages/layer7-apihub/README.md).

### Add a Page

In this example, we'll add a custom contact-us form in a new page at this location `/#/contact-us`.

1. Create a contact-us form in the `ui` folder.

``` js
// in src/ui/ContactUs.js
import React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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

2. Create a custom route to access the `contact-us` component:

```js
// in src/App.js
import React from 'react';
import { Route } from 'react-router';
import { ApiHubAdmin } from 'layer7-apihub';

import { ContactUs } from './ui'; // Import the component you've just created

function ContactUsRoute() {
    return <Route
        path="/contact-us"
        component={ContactUs}
        noLayout // Do not use the layout from ApiHub
    />
}

const App = () => {
    return (
        <ApiHubAdmin
            customRoutes={[ContactUsRoute]}
        />
    );
}

export default App;
```

You can now access the custom route at URL `/#/contact-us`.
