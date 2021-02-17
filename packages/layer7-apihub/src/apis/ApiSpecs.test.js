import React from 'react';
import { DataProviderContext, renderWithRedux } from 'ra-core';
import { wait } from '@testing-library/react';

import { ApiSpecs } from './ApiSpecs';
import specs from './specs.json';

const defaultData = [
    {
        id: "17694075-6d09-4df0-8307-90f41de2f35a",
        uuid: "17694075-6d09-4df0-8307-90f41de2f35a",
        name: "SQL National Functionality",
        status: "REJECTED",
        disabledByType: null,
        description: "Networked non-volatile challenge",
        OauthCallbackUrl: "https://example.com/oauthCallback",
        OauthScope: "OOB",
        OauthType: "public",
        apiKey: "f2055ef4-dd20-4a71-bd91-18042cc348c9",
        keySecret: "3ae27eaf-c882-429f-8339-94a675088486",
        apiIds: {
            results: ["beb8833e-1876-4b31-ace3-5d50aa0d9007", "8a334a2f-de19-472a-bb11-5a6e38e1c2ee"]
        },
        _accessibleApis: ["beb8833e-1876-4b31-ace3-5d50aa0d9007"]
    },
    {
        id: "80dc52f6-1d63-4c10-bf94-cae666c03dc8",
        uuid: "80dc52f6-1d63-4c10-bf94-cae666c03dc8",
        name: "GB Future Response",
        status: "APPLICATION_PENDING_APPROVAL",
        disabledByType: null,
        description: "Distributed bifurcated customer loyalty",
        OauthCallbackUrl: "https://example.com/oauthCallback",
        OauthScope: "OOB",
        OauthType: "public",
        apiKey: "b2dcdf94-d7cf-47e1-9b03-9efb862f0a9b",
        keySecret: "b2e97991-9a8c-4160-a9e2-ea10be778f48",
        apiIds: {
            results: ["32b97328-5800-4811-b53d-1ad107d36541", "8a334a2f-de19-472a-bb11-5a6e38e1c2ee"]
        },
        _accessibleApis: ["32b97328-5800-4811-b53d-1ad107d36541"]
    },
];

const dataProvider = {
    getList: jest.fn().mockResolvedValue({
        data: defaultData,
        total: defaultData.length,
    }),
    getOne: jest.fn().mockResolvedValue({
        data: specs,
    }),
};

const initialState = {
    admin: {
        resources: {
            apis: {},
            applications: {},
            specs: {
                data: {
                    api_1: specs,
                }
            }
        },
    },
};

describe('ApiSpecs', () => {
    describe('ApiSpecs', () => {
        test('should render the ApiSpecs component', async () => {
            const { getByLabelText, queryByText } = renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <ApiSpecs record={{ id: 1 }} />
                </DataProviderContext.Provider>,
                initialState
            );

            await wait(() => {
                expect(
                  getByLabelText('resources.apis.specification.actions.search_or_select_application')
                ).not.toBeNull();
            });
        });
    });
});
