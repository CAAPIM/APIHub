// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { Children } from 'react';
import { Admin, CustomRoutes, localStorageStore, Resource } from 'react-admin';
import { Route } from 'react-router-dom';
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
    SAMLLoginConfirmPage,
} from './authentication';
import { HomePageContent } from './homepage';
import { apis } from './apis';
import { applications } from './applications';
import { documents } from './documentation';
import { userProfiles } from './userProfiles';
import { ApiHubLayout } from './ApiHubLayout';
import { readApiHubPreference } from './preferences';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({});

export const ApiHubAdmin = props => {
    const {
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
        samlLoginConfirmPage = SAMLLoginConfirmPage,
        // React Admin Settings
        theme,
        customRoutes = [],
        customRoutesNoLayout = [],
        children,
    } = props;
    const defaultLocaleFromPreferences = readApiHubPreference(
        'locale',
        defaultLocale
    );

    const defaultSidebarOpenFromPreferences = readApiHubPreference(
        'sidebarOpen',
        true
    );

    const store = localStorageStore();
    store.setItem('sidebar.open', defaultSidebarOpenFromPreferences);

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
        <Resource key="userContexts" name="userContexts" />,
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
                key="userProfiles"
                name="userProfiles"
                {...userProfiles}
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
                layout={layout}
                loginPage={loginPage}
                dashboard={dashboard}
                store={store}
                queryClient={queryClient}
                theme={theme}
                {...props}
                requireAuth={true}
            >
                {resources}
                <CustomRoutes>
                    {/* The Wiki Page displays a list of documents in a non-standard way.*/}
                    <Route path="/wiki" element={documents.list} />
                    {/* React-Router loads only the first route that matches a path.*/}
                    {/* The only way to allow customizing the pre-defined routes*/}
                    {/* is to pass the customRoutes from the props before.*/}
                    {...customRoutes}
                </CustomRoutes>
                <CustomRoutes noLayout>
                    {...customRoutesNoLayout}
                    <Route
                        path="/reset-password/*"
                        element={resetPasswordPage}
                    />
                    <Route
                        path="/saml/login/confirm"
                        element={samlLoginConfirmPage}
                    />
                    <Route path="/signup" element={signUpPage} />
                    <Route path="/new-password/*" element={newPasswordPage} />
                    <Route path="/account-setup/*" element={accountSetupPage} />
                </CustomRoutes>
            </Admin>
        </ApiHubProvider>
    );
};
