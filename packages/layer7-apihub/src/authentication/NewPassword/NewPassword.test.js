// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import expect from 'expect';

import { NewPasswordPage } from './NewPassword';
import { fireEvent, cleanup, waitFor, render } from '@testing-library/react';
import { ApiHubProvider } from '../../ApiHubContext';
import { AdminContext } from 'react-admin';

describe('NewPassword page', () => {
    beforeEach(() => {
        global.fetch = jest.fn(url =>
            Promise.resolve({
                status: 201,
                text: () => {
                    if (url.includes('passwordResetTokenValidate')) {
                        return Promise.resolve(JSON.stringify(true));
                    }

                    if (url.includes('v2/users/password/reset')) {
                        return Promise.resolve(JSON.stringify(true));
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

    const location = {
        hostname: 'http://apihub',
        pathname: '/new-password#token/plop',
    };

    test('should display a custom Header if provided', async () => {
        const Header = () => <h1>My Header</h1>;

        const { findByText } = render(
            <ApiHubProvider url="http://apihub" tenantName="apim">
                <AdminContext>
                    <NewPasswordPage Header={Header} location={location} />
                </AdminContext>
            </ApiHubProvider>
        );

        expect(findByText('My Header')).not.toBeNull();

        // This ensure the async effects are completed to avoid act warnings
        await waitFor(() => {
            expect(
                findByText('apihub.new_password.fields.password *')
            ).not.toBeNull();
        });
    });

    /* test('should display a custom Footer if provided', async () => {
        const Footer = () => <h1>My Footer</h1>;

        const { getByText, getByLabelText } = render(
            <ApiHubProvider url="/api" tenantName="api">
                <AdminContext>
                    <NewPasswordPage Footer={Footer} location={location} />
                </AdminContext>
            </ApiHubProvider>
        );

        expect(getByText('My Footer')).not.toBeNull();

        // This ensure the async effects are completed to avoid act warnings
        await waitFor(() => {
            expect(
                getByLabelText('apihub.new_password.fields.password *')
            ).not.toBeNull();
        });
    });

    test('should display a custom Content if provided', async () => {
        const Content = () => <h1>My Content</h1>;

        const { getByText, getByLabelText } = render(
            <ApiHubProvider url="/api" tenantName="api">
                <AdminContext>
                    <NewPasswordPage Content={Content} location={location} />
                </AdminContext>
            </ApiHubProvider>
        );

        expect(getByText('My Content')).not.toBeNull();

        // This ensure the async effects are completed to avoid act warnings
        await waitFor(() => {
            expect(
                getByLabelText('apihub.new_password.fields.password *')
            ).not.toBeNull();
        });
    });

    test('should display a message when the new password token is invalid', async () => {
        global.fetch = jest.fn(url =>
            Promise.resolve({
                text: () => {
                    if (url.includes('passwordResetTokenValidate')) {
                        return Promise.resolve(undefined);
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
        const { getByText } = render(
            <ApiHubProvider url="/api" tenantName="api">
                <AdminContext>
                    <NewPasswordPage location={location} />
                </AdminContext>
            </ApiHubProvider>
        );
        await waitFor(() => {
            expect(
                getByText('apihub.new_password.notifications.invalid_token')
            ).not.toBeNull();
        });
    });

    test('should display the new password form if the new password token is valid', async () => {
        const { getByLabelText } = render(
            <ApiHubProvider url="/api" tenantName="api">
                <AdminContext>
                    <NewPasswordPage location={location} />
                </AdminContext>
            </ApiHubProvider>
        );
        await waitFor(() => {
            expect(
                getByLabelText('apihub.new_password.fields.password *')
            ).not.toBeNull();
            expect(
                getByLabelText('apihub.new_password.fields.confirm_password *')
            ).not.toBeNull();
        });
    });

    test('should not accept non matching passwords', async () => {
        const { getByLabelText, getByText } = render(
            <ApiHubProvider url="/api" tenantName="api">
                <AdminContext>
                    <NewPasswordPage location={location} />
                </AdminContext>
            </ApiHubProvider>
        );

        await waitFor(() => {
            expect(
                getByLabelText('apihub.new_password.fields.password *')
            ).not.toBeNull();
        });

        const passwordInput = getByLabelText(
            'apihub.new_password.fields.password *'
        );
        fireEvent.change(passwordInput, {
            target: { value: 'aaaaaaaaA1@' },
        });
        // Blur is necessary for final-form to detect the field has been touched
        fireEvent.blur(passwordInput);
        const confirmPasswordInput = getByLabelText(
            'apihub.new_password.fields.confirm_password *'
        );
        fireEvent.change(confirmPasswordInput, {
            target: { value: 'plip' },
        });
        // Blur is necessary for final-form to detect the field has been touched
        fireEvent.blur(confirmPasswordInput);

        fireEvent.click(
            getByLabelText('apihub.new_password.actions.change_password')
        );

        expect(
            getByText('apihub.new_password.validation.error_password_match')
        ).not.toBeNull();
    });

    test('should display a message if the password has been set', async () => {
        const { getByLabelText, getByText } = render(
            <ApiHubProvider url="/api" tenantName="api">
                <AdminContext>
                    <NewPasswordPage location={location} />
                </AdminContext>
            </ApiHubProvider>
        );

        await waitFor(() => {
            expect(
                getByLabelText('apihub.new_password.fields.password *')
            ).not.toBeNull();
        });
        fireEvent.change(
            getByLabelText('apihub.new_password.fields.password *'),
            {
                target: { value: 'aaaaaaaaA1@' },
            }
        );
        fireEvent.change(
            getByLabelText('apihub.new_password.fields.confirm_password *'),
            {
                target: { value: 'aaaaaaaaA1@' },
            }
        );

        fireEvent.click(
            getByLabelText('apihub.new_password.actions.change_password')
        );

        await waitFor(() => {
            expect(
                getByText('apihub.new_password.notifications.confirmation')
            ).not.toBeNull();
            const link = getByText(
                'apihub.new_password.actions.open_login_page'
            );
            expect(link).not.toBeNull();
        });
    });*/
});
