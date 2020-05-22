import React from 'react';
import { DataProviderContext, renderWithRedux } from 'ra-core';
import { wait } from '@testing-library/react';

import { Swagger } from './Swagger';
import specs from './specs.json';

describe('Swagger', () => {
    test('should display the API specs', async () => {
        const dataProvider = {
            getOne: jest.fn().mockResolvedValue({
                data: specs,
            }),
        };

        const initialState = {
            admin: {
                resources: {
                    specs: {
                        data: {
                            api_1: specs,
                        },
                    },
                },
            },
        };

        const { queryByText } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <Swagger id="api_1" />
            </DataProviderContext.Provider>,
            initialState
        );
        wait(() => {
            expect(
                queryByText(`Dev Console Application Operations`)
            ).not.toBeNull();
        });
    });
});
