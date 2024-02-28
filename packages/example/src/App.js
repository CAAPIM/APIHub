import React from 'react';
import { ApiHubAdmin, readApiHubPreference } from 'layer7-apihub';
import { Route } from 'react-router-dom';

import {
    LoginPage,
    ResetPasswordPage,
    NewPasswordPage,
    AccountSetupPage,
    SignUpPage,
    SAMLLoginConfirmPage,
} from './authentication';

import { Layout, HomePage } from './layout';
import { themeReducer } from './theme';
import { i18nProvider } from './i18n/i18nProvider';
import { TestPage } from './TestPage';

const App = () => {
    const { APIHUB_URL, TENANT_NAME, ORIGIN_HUB_NAME } = global.APIHUB_CONFIG;

    if (!ORIGIN_HUB_NAME) {
        throw new Error(
            'Please provide a value for the ORIGIN_HUB_NAME parameter in your configuration file'
        );
    }

    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
        .matches;

    const themeModePreference = readApiHubPreference(
        'themeMode',
        prefersDarkMode ? 'dark' : 'light'
    );

    const initialState = {
        theme: themeModePreference,
    };

    const defaultLocaleFromPreferences = readApiHubPreference('locale');

    return (
        <ApiHubAdmin
            // ApiHub Settings
            url={APIHUB_URL} // Will be guessed by ApiHubAdmin if not defined
            tenantName={TENANT_NAME} // Will be guessed by ApiHubAdmin if not defined
            originHubName={ORIGIN_HUB_NAME}
            // Custom Pages and Layout
            dashboard={HomePage}
            layout={Layout}
            loginPage={LoginPage}
            resetPasswordPage={ResetPasswordPage}
            newPasswordPage={NewPasswordPage}
            accountSetupPage={AccountSetupPage}
            signUpPage={SignUpPage}
            samlLoginConfirmPage={SAMLLoginConfirmPage}
            // React Admin Settings
            customReducers={{ theme: themeReducer }}
            i18nProvider={i18nProvider(defaultLocaleFromPreferences)}
            initialState={initialState}
            customRoutes={[<Route path="/test" component={TestPage} />]}
        />
    );
};

export default App;
