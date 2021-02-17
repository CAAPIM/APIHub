import React from 'react';
import { ApiOverview } from './ApiOverview';
import { ApiHubProvider } from '../ApiHubContext';
import { DataProviderContext, renderWithRedux } from 'ra-core';

describe('ApiOverview', () => {
    const dataProvider = {
        getManyReference: jest.fn().mockResolvedValue({
            data: []
        }),
        getList: jest.fn().mockResolvedValue({
            data: []
        }),
    };

    const initialState = {
      admin: {
        resources: {
          assets: {},
          tags: {},
          apis: {},
        },
      },
    };

    const record = {
        accessStatus: 'ENABLED',
        portalStatus: 'ENABLED',
        version: '1.0',
        source: 'APIHub',
    };

    test('should render the API Overview', () => {
        const { getByLabelText } = renderWithRedux(
          <ApiHubProvider url="http://apihub" tenantName="apim">
              <DataProviderContext.Provider value={dataProvider}>
                  <ApiOverview record={record} useIsPublisher={false} />    
              </DataProviderContext.Provider>
          </ApiHubProvider>,
          initialState
        );

        expect(getByLabelText('resources.apis.fields.portalStatus')).not.toBeNull();
    });
});
