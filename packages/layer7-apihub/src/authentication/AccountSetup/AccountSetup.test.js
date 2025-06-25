// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import expect from 'expect';

import { AccountSetupPage } from './AccountSetup';
import { fireEvent, cleanup, waitFor, render } from '@testing-library/react';
import { ApiHubProvider } from '../../ApiHubContext';
import { AdminContext } from 'react-admin';

describe('AccountSetup page', () => {
    beforeEach(() => {
        global.fetch = jest.fn(url =>
            Promise.resolve({
                status: 201,
                text: () => {
                    if (url.includes('accountSetup')) {
                        return Promise.resolve(
                            JSON.stringify({
                                email: 'test@test.xd',
                            })
                        );
                    }

                    if (url.includes('getPublicKey')) {
                        return Promise.resolve(
                            JSON.stringify({
                                respCode: 200,
                                respMsg: 'Successfully fetched public key',
                                publicKey: 'encryptionKey',
                            })
                        );
                    }
                },
            })
        );
    });

    afterEach(cleanup);

    const location = { pathname: '/account-setup#token/plop' };

    test('should display a custom Header if provided', async () => {
        const Header = () => <h1>My Header</h1>;

        const { findByText } = render(
            <ApiHubProvider url="http://apihub" tenantName="apim">
                <AdminContext>
                    <AccountSetupPage Header={Header} location={location} />
                </AdminContext>
            </ApiHubProvider>
        );

        expect(findByText('My Header')).not.toBeNull();

        // This ensure the async effects are completed to avoid act warnings
        /* await waitFor(() => {
            expect(
                findByText('apihub.account_setup.fields.firstname *')
            ).not.toBeNull();
        });*/
    });

    test('should display a custom Footer if provided', async () => {
        const Footer = () => <h1>My Footer</h1>;

        const { findByText } = render(
            <ApiHubProvider url="http://apihub" tenantName="apim">
                <AdminContext>
                    <AccountSetupPage Footer={Footer} location={location} />
                </AdminContext>
            </ApiHubProvider>
        );

        expect(findByText('My Footer')).not.toBeNull();
    });

    test('should display a custom Content if provided', async () => {
        const Content = () => <h1>My Content</h1>;

        const { findByText } = render(
            <ApiHubProvider url="http://apihub" tenantName="apim">
                <AdminContext>
                    <AccountSetupPage Content={Content} location={location} />
                </AdminContext>
            </ApiHubProvider>
        );

        expect(findByText('My Content')).not.toBeNull();
    });

    test('should display a message when the token is invalid', async () => {
        global.fetch = jest.fn(url =>
            Promise.resolve({
                status: 201,
                text: () => {
                    if (url.includes('accountSetup')) {
                        return Promise.resolve(
                            JSON.stringify({
                                data: {},
                            })
                        );
                    }

                    if (url.includes('getPublicKey')) {
                        return Promise.resolve(
                            JSON.stringify({
                                respCode: 200,
                                respMsg: 'Successfully fetched public key',
                                publicKey: 'encryptionKey',
                            })
                        );
                    }
                },
            })
        );
        const { findByText } = render(
            <ApiHubProvider url="http://apihub" tenantName="apim">
                <AdminContext>
                    <AccountSetupPage location={location} />
                </AdminContext>
            </ApiHubProvider>
        );
        await waitFor(() => {
            expect(
                findByText('apihub.account_setup.notifications.invalid_request')
            ).not.toBeNull();
        });
    });

    test('should display the account setup form if the token is valid', async () => {
        const { findByText } = render(
            <ApiHubProvider url="http://apihub" tenantName="apim">
                <AdminContext>
                    <AccountSetupPage location={location} />
                </AdminContext>
            </ApiHubProvider>
        );

        await waitFor(() => {
            expect(
                findByText('apihub.account_setup.fields.firstname *')
            ).not.toBeNull();
            expect(
                findByText('apihub.account_setup.fields.lastname *')
            ).not.toBeNull();
            expect(
                findByText('apihub.account_setup.fields.email *')
            ).not.toBeNull();
            expect(
                findByText('apihub.account_setup.fields.username *')
            ).not.toBeNull();
            expect(
                findByText('apihub.account_setup.fields.password *')
            ).not.toBeNull();
            expect(
                findByText('apihub.account_setup.fields.confirm_password *')
            ).not.toBeNull();
        });
    });

    test.skip('should not accept non matching passwords', async () => {
        const { findByText } = render(
            <ApiHubProvider url="http://apihub" tenantName="apim">
                <AccountSetupPage location={location} />
            </ApiHubProvider>
        );

        await waitFor(() => {
            expect(
                findByText('apihub.account_setup.fields.password *')
            ).not.toBeNull();
        });

        const passwordInput = findByText(
            'apihub.account_setup.fields.password *'
        );
        fireEvent.change(passwordInput, {
            target: { value: 'aaaaaaaaA1@' },
        });
        // Blur is necessary for final-form to detect the field has been touched
        fireEvent.blur(passwordInput);
        const confirmPasswordInput = findByText(
            'apihub.account_setup.fields.confirm_password *'
        );
        fireEvent.change(confirmPasswordInput, {
            target: { value: 'plip' },
        });
        // Blur is necessary for final-form to detect the field has been touched
        fireEvent.blur(confirmPasswordInput);

        fireEvent.click(findByText('apihub.account_setup.actions.submit'));

        expect(
            findByText('apihub.account_setup.validation.error_password_match')
        ).not.toBeNull();
    });
});
