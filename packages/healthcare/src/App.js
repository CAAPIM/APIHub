import React from 'react';
import { ApiHubAdmin, userProfiles } from 'layer7-apihub';
import { Resource } from 'react-admin';
import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';

import {
    LoginPage,
    ResetPasswordPage,
    NewPasswordPage,
    AccountSetupPage,
    SignUpPage,
} from './authentication';

import { AuthenticatedLayout } from './layout';
import { LandingPage } from './LandingPage';
import { HomePage } from './homepage';
import { dataProvider } from './dataProvider';
import { apis } from './apis';
import { applications } from './applications';
import { documents } from './documentation';

const App = () => {
    const { PAGE_TITLE, APIHUB_URL, TENANT_NAME } = global.APIHUB_CONFIG;

    return (
        <>
            <Helmet>
                <title>{PAGE_TITLE}</title>
            </Helmet>
            <ApiHubAdmin
                url={APIHUB_URL} // Will be guessed by ApiHubAdmin if not defined
                tenantName={TENANT_NAME} // Will be guessed by ApiHubAdmin if not defined
                layout={AuthenticatedLayout}
                loginPage={LoginPage}
                resetPasswordPage={ResetPasswordPage}
                newPasswordPage={NewPasswordPage}
                accountSetupPage={AccountSetupPage}
                signUpPage={SignUpPage}
                customRoutes={[
                    <Route path="/dashboard" exact component={HomePage} />,
                    <Route path="/" exact component={LandingPage} noLayout />,
                    <Route path="/wiki" component={documents.list} />,
                ]}
                dataProvider={dataProvider(APIHUB_URL, TENANT_NAME)}
            >
                <Resource name="apis" {...apis} />
                <Resource name="applications" {...applications} />
                <Resource name="userProfiles" {...userProfiles} />
            </ApiHubAdmin>
        </>
    );
};

export default App;
