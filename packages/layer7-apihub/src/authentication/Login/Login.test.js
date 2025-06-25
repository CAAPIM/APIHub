// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';

import { LoginPage } from './Login';
import { ApiHubProvider } from '../../ApiHubContext';
import { AdminContext } from 'react-admin';

global.Request = class MockRequest {
    constructor(input, init) {
        this.url = input;
        this.method = init?.method || 'GET';
        this.headers = new Headers(init?.headers);
        this.body = init?.body;
    }
};

describe('Login page', () => {
    global.fetch = jest.fn(url =>
        Promise.resolve({
            text: () => {
                if (url.includes('schemes')) {
                    return Promise.resolve(
                        JSON.stringify({
                            respCode: 200,
                            authSchemes: [
                                {
                                    defaultConfig: false,
                                    description: 'description 1',
                                    name: 'scheme 1',
                                    uuid: 'uuid-1',
                                },
                            ],
                        })
                    );
                }

                return Promise.resolve(
                    JSON.stringify({
                        REGISTRATION_STATUS: 'ENABLED',
                        REGISTRATION_REQUEST_WORKFLOW: 'ENABLED',
                        SSO_ENABLED: 'ENABLED',
                        REGISTRATION_TERMS_OF_USE: 'ENABLED',
                    })
                );
            },
        })
    );

    test.skip('should display a custom Header if provided', async () => {
        const Header = () => <h1>My Header</h1>;

        const { findByText } = render(
            <ApiHubProvider url="http://apihub" tenantName="apim">
                <AdminContext>
                    <LoginPage Header={Header} />
                </AdminContext>
            </ApiHubProvider>
        );

        expect(findByText('My Header')).not.toBeNull();
        // The following ensure we wait for the side effect to apply
        // before exiting the tests, avoiding unstable tests and react warnings
        await findByText('apihub.login.actions.sign_up');
        await findByText('apihub.login.actions.sign_in');
    });

    test.skip('should display a custom Footer if provided', async () => {
        const Footer = () => <h1>My Footer</h1>;

        const { findByText } = render(
            <ApiHubProvider url="http://apihub" tenantName="apim">
                <AdminContext>
                    <LoginPage Footer={Footer} />
                </AdminContext>
            </ApiHubProvider>
        );

        expect(findByText('My Footer')).not.toBeNull();
        // The following ensure we wait for the side effect to apply
        // before exiting the tests, avoiding unstable tests and react warnings
        await findByText('apihub.login.actions.sign_up');
        await findByText('apihub.login.actions.sign_in');
    });

    test.skip('should display a custom Content if provided', async () => {
        const Content = () => <h1>My Content</h1>;

        const { findByText } = render(
            <ApiHubProvider url="http://apihub" tenantName="apim">
                <AdminContext>
                    <LoginPage Content={Content} />
                </AdminContext>
            </ApiHubProvider>
        );

        expect(findByText('My Content')).not.toBeNull();
        // The following ensure we wait for the side effect to apply
        // before exiting the tests, avoiding unstable tests and react warnings
        await findByText('apihub.login.actions.sign_up');
        await findByText('apihub.login.actions.sign_in');
    });

    test.skip('should display the credentials login form', async () => {
        const { findByText } = render(
            <ApiHubProvider url="http://apihub" tenantName="apim">
                <AdminContext>
                    <LoginPage />
                </AdminContext>
            </ApiHubProvider>
        );

        expect(findByText('apihub.login.fields.username *')).not.toBeNull();
        expect(findByText('apihub.login.fields.password *')).not.toBeNull();
        // The following ensure we wait for the side effect to apply
        // before exiting the tests, avoiding unstable tests and react warnings
        await findByText('apihub.login.actions.sign_up');
        await findByText('apihub.login.actions.sign_in');
    });
});
