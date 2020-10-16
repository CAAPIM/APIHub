import React from 'react';
import expect from 'expect';
import { renderWithRedux } from 'react-admin';

import { ResetPasswordPage } from './ResetPassword';
import { ApiHubProvider } from '../../ApiHubContext';

describe('Reset Password page', () => {
    test('should display a custom Header if provided', () => {
        const Header = () => <h1>My Header</h1>;

        const { getByText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <ResetPasswordPage Header={Header} />
            </ApiHubProvider>
        );

        expect(getByText('My Header')).not.toBeNull();
    });

    test('should display a custom Footer if provided', () => {
        const Footer = () => <h1>My Footer</h1>;

        const { getByText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <ResetPasswordPage Footer={Footer} />
            </ApiHubProvider>
        );

        expect(getByText('My Footer')).not.toBeNull();
    });

    test('should display a custom Content if provided', () => {
        const Content = () => <h1>My Content</h1>;

        const { getByText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <ResetPasswordPage Content={Content} />
            </ApiHubProvider>
        );

        expect(getByText('My Content')).not.toBeNull();
    });

    test('should display the user login form', async () => {
        const { getByLabelText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <ResetPasswordPage />
            </ApiHubProvider>
        );
        expect(
            getByLabelText('apihub.reset_password.fields.username *')
        ).not.toBeNull();
    });
});
