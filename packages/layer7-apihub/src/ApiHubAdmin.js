import React from 'react';
import { Admin, Resource } from 'react-admin';
import { Route } from 'react-router';
import merge from 'lodash/fp/merge';

import {
    ApiHubProvider,
    guessApihubUrl,
    guessApihubTenantName,
} from './ApiHubContext';
import { authProvider } from './authentication';
import { dataProvider } from './dataProvider';
import { i18nProvider, defaultLocale } from './i18n';
import {
    LoginPage,
    NewPasswordPage,
    ResetPasswordPage,
    AccountSetupPage,
    SignUpPage,
} from './authentication';
import { HomePageContent } from './homepage';
import { apis } from './apis';
import { applications } from './applications';
import { userContexts } from './userContexts';
import { ApiHubLayout } from './ApiHubLayout';

import { readApiHubPreference } from './preferences';
import { theme as defaultTheme } from './theme';

import { documentationReducer } from './apis/Documentation/documentationReducer';

const defaultCustomRoutes = [];

export const ApiHubAdmin = ({
    // ApiHub Settings
    url = guessApihubUrl(),
    tenantName = guessApihubTenantName(),
    useSameOrigin = true,
    // Custom Pages and Layout
    dashboard = HomePageContent,
    layout = ApiHubLayout,
    loginPage = LoginPage,
    resetPasswordPage = ResetPasswordPage,
    newPasswordPage = NewPasswordPage,
    accountSetupPage = AccountSetupPage,
    signUpPage = SignUpPage,
    // React Admin Settings
    theme = defaultTheme,
    customReducers,
    customRoutes = defaultCustomRoutes,
    initialState,
    ...props
}) => {
    const defaultLocaleFromPreferences = readApiHubPreference(
        'locale',
        defaultLocale
    );

    const defaultSidebarOpenFromPreferences = readApiHubPreference(
        'sidebarOpen',
        true
    );

    const finalInitialState = merge(
        {
            admin: {
                ui: {
                    sidebarOpen: !!defaultSidebarOpenFromPreferences,
                    viewVersion: 0,
                },
            },
        },
        initialState
    );

    return (
        <ApiHubProvider url={url} tenantName={tenantName}>
            <Admin
                authProvider={authProvider(url, tenantName)}
                dataProvider={dataProvider(url, tenantName)}
                i18nProvider={i18nProvider(defaultLocaleFromPreferences)}
                theme={theme}
                layout={layout}
                loginPage={loginPage}
                dashboard={dashboard}
                customRoutes={[
                    <Route
                        path="/reset-password"
                        component={resetPasswordPage}
                        noLayout
                    />,
                    <Route
                        path="/new-password"
                        component={newPasswordPage}
                        noLayout
                    />,
                    <Route
                        path="/account-setup"
                        component={accountSetupPage}
                        noLayout
                    />,
                    <Route path="/signup" component={signUpPage} noLayout />,
                    ...customRoutes,
                ]}
                customReducers={merge(documentationReducer, customReducers)}
                initialState={finalInitialState}
                {...props}
            >
                <Resource name="apis" {...apis} />
                <Resource name="apiGroups" />
                <Resource name="applications" {...applications} />
                <Resource name="assets" />
                <Resource name="specs" />
                <Resource name="tags" />
                <Resource name="documents" />
                <Resource name="userContexts" {...userContexts} />
            </Admin>
        </ApiHubProvider>
    );
};
