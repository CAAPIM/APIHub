// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { ApplicationDetailsKeyClient } from './ApplicationDetailsKeyClient';
import { ApiHubProvider } from '../ApiHubContext';
import { render } from '@testing-library/react';
import { AdminContext } from 'react-admin';

describe('ApplicationDetailsKeyClient', () => {
    const dataProvider = {
        getManyReference: jest.fn().mockResolvedValue({
            data: [],
        }),
        getList: jest.fn().mockResolvedValue({
            data: [],
        }),
    };

    test('should render the ApplicationDetailsKeyClient', async () => {
        const apiKeyData = {
            id: 'l74d927a30dd404a9b9f950963d0a957d4',
            apiKey: 'l74d927a30dd404a9b9f950963d0a957d4',
            applicationUuid: '39be288d-a811-44fd-bfa5-a0f6f0b512b9',
            authMethod: 'SECRET',
            name: 'test key3',
            keySecret: '52e096090f064f1183c2cb9bb07c57c3',
            defaultKey: true,
            oauthCallbackUrl: 'https://google.com',
            oauthScope: 'oob',
            oauthType: 'CONFIDENTIAL',
            status: 'ENABLED',
            keySecretHashed: false,
            createTs: 1616695614566,
            modifyTs: 1616695651307,
        };
        const { getByText, getAllByLabelText, findByText } = render(
            <ApiHubProvider url="http://apihub" tenantName="apim">
                <AdminContext dataProvider={dataProvider}>
                    <ApplicationDetailsKeyClient
                        id={apiKeyData.id}
                        key={apiKeyData.id}
                        data={apiKeyData}
                        includeSecret={true}
                    />
                </AdminContext>
            </ApiHubProvider>
        );
        expect(getByText(apiKeyData.name)).not.toBeNull();
        expect(
            getByText('resources.applications.fields.default')
        ).not.toBeNull();
        expect(
            getByText('resources.applications.status.enabled')
        ).not.toBeNull();
        expect(
            findByText('resources.applications.fields.scope')
        ).not.toBeNull();
        expect(getByText(apiKeyData.oauthScope)).not.toBeNull();
        expect(
            findByText('resources.applications.fields.callbackUrl')
        ).not.toBeNull();
        expect(getByText(apiKeyData.oauthCallbackUrl)).not.toBeNull();
        expect(
            findByText('resources.applications.fields.apiKeyClientID')
        ).not.toBeNull();
        expect(getByText(apiKeyData.apiKey)).not.toBeNull();
        expect(
            findByText('resources.applications.fields.sharedSecretClientSecret')
        ).not.toBeNull();
        expect(getByText(apiKeyData.keySecret)).not.toBeNull();
        expect(findByText('resources.applications.fields.type')).not.toBeNull();
        expect(getByText(apiKeyData.oauthType)).not.toBeNull();
    });
    test('should not render optional fields if they are not defined', async () => {
        const apiKeyData = {
            id: 'l74d927a30dd404a9b9f950963d0a957d4',
            apiKey: 'l74d927a30dd404a9b9f950963d0a957d4',
            applicationUuid: '39be288d-a811-44fd-bfa5-a0f6f0b512b9',
            authMethod: 'SECRET',
            name: 'test key3',
            keySecret: '52e096090f064f1183c2cb9bb07c57c3',
            defaultKey: false,
            oauthCallbackUrl: '',
            oauthScope: '',
            oauthType: '',
            status: 'ENABLED',
            keySecretHashed: false,
            createTs: 1616695614566,
            modifyTs: 1616695651307,
        };
        const { queryByLabelText } = render(
            <ApiHubProvider url="http://apihub" tenantName="apim">
                <AdminContext dataProvider={dataProvider}>
                    <ApplicationDetailsKeyClient
                        id={apiKeyData.id}
                        key={apiKeyData.id}
                        data={apiKeyData}
                        includeSecret={false}
                    />
                </AdminContext>
            </ApiHubProvider>
        );
        expect(
            queryByLabelText('resources.applications.fields.default')
        ).toBeNull();
        expect(
            queryByLabelText('resources.applications.fields.callbackUrl')
        ).toBeNull();
        expect(
            queryByLabelText('resources.applications.fields.scope')
        ).toBeNull();
        expect(
            queryByLabelText(
                'resources.applications.fields.sharedSecretClientSecret'
            )
        ).toBeNull();
        expect(
            queryByLabelText('resources.applications.fields.type')
        ).toBeNull();
    });
});
