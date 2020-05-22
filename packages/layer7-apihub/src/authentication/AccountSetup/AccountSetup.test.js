import React from 'react';
import expect from 'expect';
import { renderWithRedux } from 'react-admin';

import { AccountSetupPage } from './AccountSetup';
import { fireEvent, cleanup, wait } from '@testing-library/react';
import { ApiHubProvider } from '../../ApiHubContext';

describe('AccountSetup page', () => {
    beforeEach(() => {
        global.fetch = jest.fn(url =>
            Promise.resolve({
                status: 201,
                json: () => {
                    if (url.includes('accountSetup')) {
                        return Promise.resolve({
                            email: 'test@test.net',
                        });
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

    const location = { pathname: '/account-setup#token/plop' };

    test('should display a custom Header if provided', async () => {
        const Header = () => <h1>My Header</h1>;

        const { getByText, getByLabelText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <AccountSetupPage Header={Header} location={location} />
            </ApiHubProvider>
        );

        expect(getByText('My Header')).not.toBeNull();

        // This ensure the async effects are completed to avoid act warnings
        await wait(() => {
            expect(
                getByLabelText('apihub.account_setup.fields.firstname *')
            ).not.toBeNull();
        });
    });

    test('should display a custom Footer if provided', async () => {
        const Footer = () => <h1>My Footer</h1>;

        const { getByText, getByLabelText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <AccountSetupPage Footer={Footer} location={location} />
            </ApiHubProvider>
        );

        expect(getByText('My Footer')).not.toBeNull();

        // This ensure the async effects are completed to avoid act warnings
        await wait(() => {
            expect(
                getByLabelText('apihub.account_setup.fields.firstname *')
            ).not.toBeNull();
        });
    });

    test('should display a custom Content if provided', async () => {
        const Content = () => <h1>My Content</h1>;

        const { getByText, getByLabelText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <AccountSetupPage Content={Content} location={location} />
            </ApiHubProvider>
        );

        expect(getByText('My Content')).not.toBeNull();

        // This ensure the async effects are completed to avoid act warnings
        await wait(() => {
            expect(
                getByLabelText('apihub.account_setup.fields.firstname *')
            ).not.toBeNull();
        });
    });

    test('should display a message when the token is invalid', async () => {
        global.fetch = jest.fn(url =>
            Promise.resolve({
                status: 201,
                json: () => {
                    if (url.includes('accountSetup')) {
                        return Promise.resolve({
                            data: {},
                        });
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
                <AccountSetupPage location={location} />
            </ApiHubProvider>
        );
        await wait(() => {
            expect(
                getByText('apihub.account_setup.notifications.invalid_request')
            ).not.toBeNull();
        });
    });

    test('should display the account setup form if the token is valid', async () => {
        const { getByLabelText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <AccountSetupPage location={location} />
            </ApiHubProvider>
        );

        await wait(() => {
            expect(
                getByLabelText('apihub.account_setup.fields.firstname *')
            ).not.toBeNull();
            expect(
                getByLabelText('apihub.account_setup.fields.lastname *')
            ).not.toBeNull();
            expect(
                getByLabelText('apihub.account_setup.fields.email *')
            ).not.toBeNull();
            expect(
                getByLabelText('apihub.account_setup.fields.username *')
            ).not.toBeNull();
            expect(
                getByLabelText('apihub.account_setup.fields.password *')
            ).not.toBeNull();
            expect(
                getByLabelText('apihub.account_setup.fields.confirm_password *')
            ).not.toBeNull();
        });
    });

    test('should not accept non matching passwords', async () => {
        const { getByLabelText, getByText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <AccountSetupPage location={location} />
            </ApiHubProvider>
        );

        await wait(() => {
            expect(
                getByLabelText('apihub.account_setup.fields.password *')
            ).not.toBeNull();
        });

        const passwordInput = getByLabelText(
            'apihub.account_setup.fields.password *'
        );
        fireEvent.change(passwordInput, {
            target: { value: 'aaaaaaaaA1@' },
        });
        // Blur is necessary for final-form to detect the field has been touched
        fireEvent.blur(passwordInput);
        const confirmPasswordInput = getByLabelText(
            'apihub.account_setup.fields.confirm_password *'
        );
        fireEvent.change(confirmPasswordInput, {
            target: { value: 'plip' },
        });
        // Blur is necessary for final-form to detect the field has been touched
        fireEvent.blur(confirmPasswordInput);

        fireEvent.click(getByLabelText('apihub.account_setup.actions.submit'));

        expect(
            getByText('apihub.account_setup.validation.error_password_match')
        ).not.toBeNull();
    });
});
