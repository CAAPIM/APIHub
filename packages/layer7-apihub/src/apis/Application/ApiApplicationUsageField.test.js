import React from 'react';
import { DataProviderContext, renderWithRedux } from 'ra-core';
import { ApiApplicationUsageField } from './ApiApplicationUsageField';
import { wait } from '@testing-library/react';

const initialState = {
    admin: {
        resources: {
          applications: {},
        },
    },
};

const dataProvider = {
    getList: jest.fn().mockResolvedValue({
        data: [
            {
                id: "d9a2909c-b532-4a8a-8a39-e17001e9b225",
            },
            {
                id: "9a7d8894-5e40-47b8-8d92-f9270516b526",
            },
            {
                id: "41c60b1e-80c6-4dd5-9a6f-da2fd1924cb6",
            },
        ],
        total: 3,
    }),
};

describe('ApiApplicationUsageField', () => {
    test('render application usage', async () => {
        const { getByText } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <ApiApplicationUsageField record={{}} />
            </DataProviderContext.Provider>,
            initialState
        );

        await wait(() => {
            expect(getByText('3')).not.toBeNull();
        });
    })
})
