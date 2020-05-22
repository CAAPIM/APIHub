import React from 'react';
import { ApiHubAdmin, readApiHubPreference, useBranding } from 'layer7-apihub';
import { Helmet } from 'react-helmet';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import {
    CustomLoginPage,
    CustomResetPasswordPage,
    CustomNewPasswordPage,
    CustomAccountSetupPage,
    CustomSignUpPage,
} from './authentication';

import { CustomLayout } from './layout';
import { themeReducer } from './theme';
import { i18nProvider } from './i18n/i18nProvider';
import { CustomHomePage } from './layout';

const App = () => {
    const {
        PAGE_TITLE,
        APIHUB_URL,
        TENANT_NAME,
        USE_BRANDING_ICONS,
    } = global.APIHUB_CONFIG;
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const themeModePreference = readApiHubPreference(
        'themeMode',
        prefersDarkMode ? 'dark' : 'light'
    );

    const initialState = {
        theme: themeModePreference,
    };

    const defaultLocaleFromPreferences = readApiHubPreference('locale');

    const { favicon } = useBranding(APIHUB_URL);

    return (
        <>
            <Helmet title={PAGE_TITLE}>
                {USE_BRANDING_ICONS && favicon && (
                    <link
                        id="favicon"
                        rel="icon"
                        href={favicon}
                        type="image/x-icon"
                    />
                )}
            </Helmet>
            <ApiHubAdmin
                // ApiHub Settings
                url={APIHUB_URL} // Will be guessed by ApiHubAdmin if not defined
                tenantName={TENANT_NAME} // Will be guessed by ApiHubAdmin if not defined
                // Custom Pages and Layout
                dashboard={CustomHomePage}
                layout={CustomLayout}
                loginPage={CustomLoginPage}
                resetPasswordPage={CustomResetPasswordPage}
                newPasswordPage={CustomNewPasswordPage}
                accountSetupPage={CustomAccountSetupPage}
                signUpPage={CustomSignUpPage}
                // React Admin Settings
                customReducers={{ theme: themeReducer }}
                i18nProvider={i18nProvider(defaultLocaleFromPreferences)}
                initialState={initialState}
            />
        </>
    );
};

export default App;
