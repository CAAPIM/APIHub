import React from 'react';
import { isSoapApi } from './ApiShow';
import { DataProviderContext, renderWithRedux } from 'ra-core';
import { waitFor } from '@testing-library/react';

const defaultData = {
    id: "5c9217d4-13d2-4f3e-a78a-1a2d4e710f19",
    uuid: "5c9217d4-13d2-4f3e-a78a-1a2d4e710f19",
    orgUuid: "d7a6863e-b124-4023-bf64-9344678d508d",
    name: "RSS Forward Accountability",
    description: "Upgradable secondary help-desk",
    createTs: 1576962923790,
    modifyTs: 1592874748358,
    version: "1.4.2",
    ssgServiceType: "SOAP",
    portalStatus: "DEPRECATED",
    accessStatus: "PRIVATE",
    apiEulaUuid: "c9406345-eb76-11e3-b0cd-000nosaj86a8",
    applicationUsage: 0,
    tags: [
        "Map", "Government", "Procurement"
    ]
};

describe('ApiShow', () => {
    const dataProvider = {
        getOne: jest.fn().mockResolvedValue({
            data: defaultData,
        }),
        getPermissions: jest.fn().mockResolvedValue({
            id: defaultData.id,
            canEdit: false,
        }),
    };

    const initialState = {
      admin: {
        resources: {
          apis: {},
        },
      },
    };

    describe('ApiShow', () => {
        test.skip('should render the APIShow component', async () => {
            const { queryByText } = renderWithRedux(
              <DataProviderContext.Provider value={dataProvider}>
                <ApiShow id={defaultData.id} />
              </DataProviderContext.Provider>,
              initialState
            );

            await waitFor(() => {
              expect(
                queryByText(defaultData.name)
              ).not.toBeNull();
            });
        });
    });

    describe('isSoapApi', () => {
        test('should return true if apiServiceType is soap', () => {
            const record = {
                apiServiceType: 'soap',
                ssgServiceType: undefined,
            };

            expect(isSoapApi(record)).toBe(true);
        });

        test('should return true if ssgServiceType is soap', () => {
            const record = {
                apiServiceType: undefined,
                ssgServiceType: 'soap',
            };

            expect(isSoapApi(record)).toBe(true);
        });

        test('should accept uppercase and lowercase values for the apiServiceType', () => {
            const recordMixed = {
                apiServiceType: 'SoAp',
                ssgServiceType: undefined,
            };

            expect(isSoapApi(recordMixed)).toBe(true);

            const recordLowercase = {
                apiServiceType: 'soap',
                ssgServiceType: undefined,
            };

            expect(isSoapApi(recordLowercase)).toBe(true);

            const recordUppercase = {
                apiServiceType: 'SOAP',
                ssgServiceType: undefined,
            };

            expect(isSoapApi(recordUppercase)).toBe(true);
        });

        test('should accept uppercase and lowercase values for the ssgServiceType', () => {
            const recordMixed = {
                apiServiceType: undefined,
                ssgServiceType: 'SoAp',
            };

            expect(isSoapApi(recordMixed)).toBe(true);

            const recordLowercase = {
                apiServiceType: undefined,
                ssgServiceType: 'soap',
            };

            expect(isSoapApi(recordLowercase)).toBe(true);

            const recordUppercase = {
                apiServiceType: undefined,
                ssgServiceType: 'SOAP',
            };

            expect(isSoapApi(recordUppercase)).toBe(true);
        });

        test('should return false if both apiServiceType and ssgServiceType are not soap', () => {
            const record = {
                apiServiceType: 'rest',
                ssgServiceType: 'rest',
            };

            expect(isSoapApi(record)).toBe(false);
        });
    });
});
