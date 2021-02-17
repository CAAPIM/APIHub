import React from 'react';
import { renderWithRedux } from 'ra-core';

import { ApiHubProvider } from '../../ApiHubContext';
import { LoginForm } from './LoginForm';
import { wait } from '@testing-library/react';

describe('LoginForm', () => {
  it('renders the login form', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            text: () =>
                Promise.resolve(
                    JSON.stringify({
                        respCode: 200,
                        respMsg:
                            'Successfully fetched Authentication Schemes',
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

        const { getByText, getByLabelText } = renderWithRedux(
            <ApiHubProvider url="/api" tenantName="api">
                <LoginForm />
            </ApiHubProvider>
        );

        await wait(() => {
            expect(getByLabelText('apihub.login.fields.username *')).not.toBeNull();
            expect(getByLabelText('apihub.login.fields.password *')).not.toBeNull();
        });
  });
});
