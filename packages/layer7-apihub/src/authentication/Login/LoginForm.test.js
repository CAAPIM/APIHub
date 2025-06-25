// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';

import { ApiHubProvider } from '../../ApiHubContext';
import { LoginForm } from './LoginForm';
import { waitFor, render } from '@testing-library/react';
import { AdminContext } from 'react-admin';

describe('LoginForm', () => {
    it('renders the login form', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            text: () =>
                Promise.resolve(
                    JSON.stringify({
                        respCode: 200,
                        respMsg: 'Successfully fetched Authentication Schemes',
                        isOktaProxied: false,
                        authSchemes: [
                            {
                                authMethod: 'DEFAULT',
                                defaultConfig: true,
                                description: 'description one',
                                name: 'name one',
                                uuid: 'uuid one',
                            },
                            {
                                authMethod: 'SAML',
                                defaultConfig: false,
                                description: 'description two',
                                name: 'name two',
                                uuid: 'uuid two',
                            },
                            {
                                authMethod: 'SOME_AUTH',
                                defaultConfig: false,
                                description: 'description three',
                                name: 'name three',
                                uuid: 'uuid three',
                            },
                        ],
                    })
                ),
        });

        const { findByText } = render(
            <ApiHubProvider url="/api" tenantName="api">
                <AdminContext>
                    <LoginForm />
                </AdminContext>
            </ApiHubProvider>
        );

        await waitFor(() => {
            expect(findByText('apihub.login.fields.username *')).not.toBeNull();
            expect(findByText('apihub.login.fields.password *')).not.toBeNull();
        });
    });
});
