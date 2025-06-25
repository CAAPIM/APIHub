// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { AuthSchemeList } from './AuthSchemeList';
import { render } from '@testing-library/react';
import { AdminContext } from 'react-admin';

const schemes = [
    {
        uuid: 'ff739792-adfe-4879-869d-bc2c85054617',
        url:
            'https://apim.broadcom.net?provider=ff739792-adfe-4879-869d-bc2c85054617',
        name: 'ApiHub LDAP1',
        description: 'LDAP Authentication 1',
        defaultConfig: false,
        credsReqd: true,
        authMethod: 'LDAP',
        advancedConfigurations: {
            enhancedPasswordSecurity: 'no',
        },
    },
    {
        uuid: '3a9b41ac-a17d-47ba-971f-ecaee014ba9d',
        url:
            'https://apim.broadcom.net?provider=3a9b41ac-a17d-47ba-971f-ecaee014ba9d',
        name: 'ApiHub LDAP2',
        description: 'LDAP Authentication 2',
        defaultConfig: false,
        credsReqd: true,
        authMethod: 'LDAP',
        advancedConfigurations: {
            enhancedPasswordSecurity: 'no',
        },
    },
];

describe('AuthSchemeList', () => {
    it('displays a list of auth schemes', () => {
        const { getByText } = render(
            <AdminContext>
                <AuthSchemeList
                    authSchemes={schemes}
                    onClick={() => alert('hello')}
                />
            </AdminContext>
        );

        expect(getByText('LDAP Authentication 1')).not.toBeNull();
        expect(getByText('LDAP Authentication 2')).not.toBeNull();
    });
});
