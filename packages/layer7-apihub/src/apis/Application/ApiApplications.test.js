import React from 'react';
import { DataProviderContext, renderWithRedux } from 'ra-core';
import { ApiApplications } from './ApiApplications';
import { fireEvent, wait } from '@testing-library/react';

describe('Applications', () => {
    test('should allow to select an application', async () => {
        const queryKey = '{"filter":{"apiUuid":"api_1"}}';

        const initialState = {
            admin: {
                resources: {
                    applications: {
                        list: {
                            cachedRequests: {
                                [queryKey]: {
                                    data: [
                                        {
                                            id: 1,
                                            name: 'application 1',
                                        },
                                        {
                                            id: 2,
                                            name: 'application 2',
                                        },
                                        {
                                            id: 3,
                                            name: 'application 3',
                                        },
                                    ],
                                    total: 3,
                                },
                            },
                        },
                    },
                },
            },
        };

        const dataProvider = {
            getList: jest.fn().mockResolvedValue({
                data: [
                    {
                        id: 1,
                        name: 'application 1',
                    },
                    {
                        id: 2,
                        name: 'application 2',
                    },
                    {
                        id: 3,
                        name: 'application 3',
                    },
                ],
                total: 3,
            }),
        };

        const { getByLabelText, queryByText } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <ApiApplications id="api_1" />
            </DataProviderContext.Provider>,
            initialState
        );

        await wait(() => {
            const select = getByLabelText(
                'resources.apis.specification.actions.search_or_select_application'
            );
            fireEvent.mouseDown(select);
            // Enter search criteria
            fireEvent.change(select, { target: { value: 'application' } });
        });

        await wait(() => {
            expect(queryByText('application 1')).not.toBeNull();
            expect(queryByText('application 2')).not.toBeNull();
            expect(queryByText('application 3')).not.toBeNull();
        });

        expect.assertions(3);
    });

    test('should display the selected application credentials', async () => {
        const initialState = {
            admin: {
                resources: {
                    applications: {
                        data: {
                            1: {
                                apiKey: 'the_api_key',
                                keySecret: 'the_api_secret',
                            },
                        },
                    },
                },
            },
        };

        const dataProvider = {
            getList: jest.fn().mockResolvedValue({
                data: [
                    {
                        id: 1,
                        name: 'application 1',
                        apiKey: 'the_api_key',
                        keySecret: 'the_api_secret',
                    },
                ],
                total: 1,
            }),
            getOne: jest.fn().mockResolvedValue({
                data: {
                    id: 1,
                    name: 'application 1',
                    apiKey: 'the_api_key',
                    keySecret: 'the_api_secret',
                },
            }),
        };

        const { getByLabelText, queryByText, getByText } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <ApiApplications id="api_1" />
            </DataProviderContext.Provider>,
            initialState
        );

        await wait(() => {
            const select = getByLabelText(
                'resources.apis.specification.actions.search_or_select_application'
            );
            fireEvent.mouseDown(select);
            // Enter search criteria
            fireEvent.change(select, { target: { value: 'application' } });
        });

        await wait(() => {
            expect(queryByText('application 1')).not.toBeNull();
        });

        fireEvent.click(getByText('application 1'));

        await wait(() => {
            expect(queryByText('the_api_key')).not.toBeNull();
            expect(queryByText('the_api_secret')).not.toBeNull();
        });

        expect.assertions(3);
    });
});
