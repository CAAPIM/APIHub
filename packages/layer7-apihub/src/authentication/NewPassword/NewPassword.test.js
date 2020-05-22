import React from 'react';
import expect from 'expect';
import { renderWithRedux } from 'react-admin';

import { NewPasswordPage } from './NewPassword';
import { fireEvent, cleanup, wait } from '@testing-library/react';
import { ApiHubProvider } from '../../ApiHubContext';

describe('NewPassword page', () => {
    beforeEach(() => {
        global.fetch = jest.fn(url =>
            Promise.resolve({
                status: 201,
                json: () => {
                    if (url.includes('passwordResetTokenValidate')) {
                        return Promise.resolve(true);
                    }

                    if (url.includes('UpdateMyPassword')) {
                        return Promise.resolve(true);
                    }

                    if (url.includes('getPublicKey')) {
                        return Promise.resolve({
                            respCode: 200,
                            respMsg: 'Successfully fetched public key',
                            publicKey: 'encryptionKey',
                        });
                    }
                },
            })
        );
    });

    afterEach(cleanup);

    const location = { pathname: '/new-password#token/plop' };

    test('should display a custom Header if provided', async () => {
        const Header = () => <h1>My Header</h1>;

        const { getByText, getByLabelText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <NewPasswordPage Header={Header} location={location} />
            </ApiHubProvider>
        );

        expect(getByText('My Header')).not.toBeNull();

        // This ensure the async effects are completed to avoid act warnings
        await wait(() => {
            expect(
                getByLabelText('apihub.new_password.fields.password *')
            ).not.toBeNull();
        });
    });

    test('should display a custom Footer if provided', async () => {
        const Footer = () => <h1>My Footer</h1>;

        const { getByText, getByLabelText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <NewPasswordPage Footer={Footer} location={location} />
            </ApiHubProvider>
        );

        expect(getByText('My Footer')).not.toBeNull();

        // This ensure the async effects are completed to avoid act warnings
        await wait(() => {
            expect(
                getByLabelText('apihub.new_password.fields.password *')
            ).not.toBeNull();
        });
    });

    test('should display a custom Content if provided', async () => {
        const Content = () => <h1>My Content</h1>;

        const { getByText, getByLabelText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <NewPasswordPage Content={Content} location={location} />
            </ApiHubProvider>
        );

        expect(getByText('My Content')).not.toBeNull();

        // This ensure the async effects are completed to avoid act warnings
        await wait(() => {
            expect(
                getByLabelText('apihub.new_password.fields.password *')
            ).not.toBeNull();
        });
    });

    test('should display a message when the new password token is invalid', async () => {
        global.fetch = jest.fn(url =>
            Promise.resolve({
                json: () => {
                    if (url.includes('passwordResetTokenValidate')) {
                        return Promise.resolve(undefined);
                    }

                    if (url.includes('getPublicKey')) {
                        return Promise.resolve({
                            respCode: 200,
                            respMsg: 'Successfully fetched public key',
                            publicKey: 'encryptionKey',
                        });
                    }
                },
            })
        );
        const { getByText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <NewPasswordPage location={location} />
            </ApiHubProvider>
        );
        await wait(() => {
            expect(
                getByText('apihub.new_password.validation.invalid_token')
            ).not.toBeNull();
        });
    });

    test('should display the new password form if the new password token is valid', async () => {
        const { getByLabelText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <NewPasswordPage location={location} />
            </ApiHubProvider>
        );
        await wait(() => {
            expect(
                getByLabelText('apihub.new_password.fields.password *')
            ).not.toBeNull();
            expect(
                getByLabelText('apihub.new_password.fields.confirm_password *')
            ).not.toBeNull();
        });
    });

    test('should not accept non matching passwords', async () => {
        const { getByLabelText, getByText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <NewPasswordPage location={location} />
            </ApiHubProvider>
        );

        await wait(() => {
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
        const { getByLabelText, getByText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <NewPasswordPage location={location} />
            </ApiHubProvider>
        );

        await wait(() => {
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

        await wait(() => {
            expect(
                getByText('apihub.new_password.notifications.confirmation')
            ).not.toBeNull();
            const link = getByText(
                'apihub.new_password.actions.open_login_page'
            );
            expect(link).not.toBeNull();
        });
    });
});
