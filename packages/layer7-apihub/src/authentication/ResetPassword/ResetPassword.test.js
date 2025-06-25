// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';

import { ResetPasswordPage } from './ResetPassword';
import { ApiHubProvider } from '../../ApiHubContext';
import { AdminContext } from 'react-admin';

describe('Reset Password page', () => {
    test.skip('should display a custom Header if provided', () => {
        const Header = () => <h1>My Header</h1>;

        const { findByText } = render(
            <ApiHubProvider url="http://apihub" tenantName="apim">
                <AdminContext>
                    <ResetPasswordPage Header={Header} />
                </AdminContext>
            </ApiHubProvider>
        );

        expect(findByText('My Header')).not.toBeNull();
    });

    test.skip('should display a custom Footer if provided', () => {
        const Footer = () => <h1>My Footer</h1>;

        const { findByText } = render(
            <ApiHubProvider url="http://apihub" tenantName="apim">
                <AdminContext>
                    <ResetPasswordPage Footer={Footer} />
                </AdminContext>
            </ApiHubProvider>
        );

        expect(findByText('My Footer')).not.toBeNull();
    });

    test.skip('should display a custom Content if provided', () => {
        const Content = () => <h1>My Content</h1>;

        const { findByText } = render(
            <ApiHubProvider url="http://apihub" tenantName="apim">
                <AdminContext>
                    <ResetPasswordPage Content={Content} />
                </AdminContext>
            </ApiHubProvider>
        );

        expect(findByText('My Content')).not.toBeNull();
    });

    test.skip('should display the user login form', async () => {
        const Content = () => <h1>My Content</h1>;
        const { findByText } = render(
            <ApiHubProvider url="http://apihub" tenantName="apim">
                <AdminContext>
                    <ResetPasswordPage Content={Content} />
                </AdminContext>
            </ApiHubProvider>
        );
        expect(
            findByText('apihub.reset_password.fields.username *')
        ).not.toBeNull();
    });
});
