import React from 'react';
import expect from 'expect';
import { renderWithRedux } from 'react-admin';

import { LoginPage } from './Login';
import { ApiHubProvider } from '../../ApiHubContext';

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

    test('should display a custom Header if provided', async () => {
        const Header = () => <h1>My Header</h1>;

        const { getByText, findByText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <LoginPage Header={Header} />
            </ApiHubProvider>
        );

        expect(getByText('My Header')).not.toBeNull();
        // The following ensure we wait for the side effect to apply
        // before exiting the tests, avoiding unstable tests and react warnings
        await findByText('apihub.login.actions.sign_up');
        await findByText('apihub.login.actions.sign_in');
    });

    test('should display a custom Footer if provided', async () => {
        const Footer = () => <h1>My Footer</h1>;

        const { getByText, findByText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <LoginPage Footer={Footer} />
            </ApiHubProvider>
        );

        expect(getByText('My Footer')).not.toBeNull();
        // The following ensure we wait for the side effect to apply
        // before exiting the tests, avoiding unstable tests and react warnings
        await findByText('apihub.login.actions.sign_up');
        await findByText('apihub.login.actions.sign_in');
    });

    test('should display a custom Content if provided', async () => {
        const Content = () => <h1>My Content</h1>;

        const { getByText, findByText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <LoginPage Content={Content} />
            </ApiHubProvider>
        );

        expect(getByText('My Content')).not.toBeNull();
        // The following ensure we wait for the side effect to apply
        // before exiting the tests, avoiding unstable tests and react warnings
        await findByText('apihub.login.actions.sign_up');
        await findByText('apihub.login.actions.sign_in');
    });

    test('should display the credentials login form', async () => {
        const { getByLabelText, findByText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <LoginPage />
            </ApiHubProvider>
        );

        expect(getByLabelText('apihub.login.fields.username *')).not.toBeNull();
        expect(getByLabelText('apihub.login.fields.password *')).not.toBeNull();
        // The following ensure we wait for the side effect to apply
        // before exiting the tests, avoiding unstable tests and react warnings
        await findByText('apihub.login.actions.sign_up');
        await findByText('apihub.login.actions.sign_in');
    });
});
