import React, { Children } from 'react';
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
import { documents } from './documentation';
import { userContexts } from './userContexts';
import { ApiHubLayout } from './ApiHubLayout';

import { readApiHubPreference } from './preferences';
import { theme as defaultTheme } from './theme';

import { documentationReducer } from './documentation/Documentation/documentationReducer';

const defaultCustomRoutes = [];

export const ApiHubAdmin = ({
    // ApiHub Settings
    url = guessApihubUrl(),
    tenantName = guessApihubTenantName(),
    originHubName,
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
    children,
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

    const resources = [
        // Resources which are needed for references but which will not have any UI
        <Resource key="apiEulas" name="apiEulas" />,
        <Resource key="apiGroups" name="apiGroups" />,
        <Resource key="assets" name="assets" />,
        <Resource key="customFields" name="customFields" />,
        <Resource key="documents" name="documents" />,
        <Resource key="organizations" name="organizations" />,
        <Resource key="specs" name="specs" />,
        <Resource key="tags" name="tags" />,
    ];

    // If the user provided their own resources, they should override the defaults.
    if (Children.count(children) > 0) {
        Array.prototype.push.apply(resources, Children.toArray(children));
    } else {
        resources.push(
            <Resource key="apis" name="apis" {...apis} />,
            <Resource
                key="applications"
                name="applications"
                {...applications}
            />,
            <Resource
                key="userContexts"
                name="userContexts"
                {...userContexts}
            />
        );
    }

    return (
        <ApiHubProvider
            url={url}
            tenantName={tenantName}
            originHubName={originHubName}
        >
            <Admin
                authProvider={authProvider(url, tenantName, originHubName)}
                dataProvider={dataProvider(url, tenantName, originHubName)}
                i18nProvider={i18nProvider(defaultLocaleFromPreferences)}
                theme={theme}
                layout={layout}
                loginPage={loginPage}
                dashboard={dashboard}
                customRoutes={[
                    // React-Router loads only the first route that matches a path.
                    // The only way to allow customizing the pre-defined routes
                    // is to pass the customRoutes from the props before.
                    ...customRoutes,
                    // The Wiki Page displays a list of documents in a non standard way.
                    <Route path="/wiki" component={documents.list} />,
                    <Route
                        path="/reset-password"
                        component={resetPasswordPage}
                        noLayout
                    />,
                    <Route
                        path="/new-password*"
                        component={newPasswordPage}
                        noLayout
                    />,
                    <Route
                        path="/account-setup*"
                        component={accountSetupPage}
                        noLayout
                    />,
                    <Route path="/signup" component={signUpPage} noLayout />,
                ]}
                customReducers={merge(documentationReducer, customReducers)}
                initialState={finalInitialState}
                {...props}
            >
                {resources}
            </Admin>
        </ApiHubProvider>
    );
};
