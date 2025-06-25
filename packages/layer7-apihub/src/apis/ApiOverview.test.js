// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { ApiOverview } from './ApiOverview';
import { ApiHubProvider } from '../ApiHubContext';
import { render } from '@testing-library/react';
import { AdminContext, RecordContextProvider } from 'react-admin';

describe('ApiOverview', () => {
    const dataProvider = {
        getManyReference: jest.fn().mockResolvedValue({
            data: [],
        }),
        getList: jest.fn().mockResolvedValue({
            data: [],
        }),
    };

    const record = {
        id: '123',
        accessStatus: 'ENABLED',
        portalStatus: 'ENABLED',
        version: '1.0',
        source: 'APIHub',
    };

    test('should render the API Overview', () => {
        const { getByText } = render(
            <ApiHubProvider url="http://apihub" tenantName="apim">
                <AdminContext dataProvider={dataProvider}>
                    {/* ApiOverview component is usually wrapped around a <Show/> which provides record context */}
                    <RecordContextProvider key={record.id} value={record}>
                        <ApiOverview useIsPublisher={false} />
                    </RecordContextProvider>
                </AdminContext>
            </ApiHubProvider>
        );

        expect(getByText('resources.apis.fields.portalStatus')).not.toBeNull();
    });
});
