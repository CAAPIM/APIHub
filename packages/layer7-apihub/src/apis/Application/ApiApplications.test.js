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
                                    totalPages: 1,
                                },
                            },
                        },
                    },
                },
            },
        };

        const dataProvider = {
            getList: type => {
                if (type === 'applications') {
                    return Promise.resolve({
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
                            {
                                id: 4,
                                name: 'app 4',
                            },
                            {
                                id: 5,
                                name: 'app 5',
                            },
                        ],
                        total: 5,
                        totalPages: 1,
                    });
                } else if (type === 'apiKeys') {
                    return Promise.resolve({
                        data: [
                            {
                                apiKey: 1,
                                id: 1,
                                name: 'key 1',
                            },
                            {
                                apiKey: 2,
                                id: 2,
                                name: 'key 2',
                            },
                        ],
                        total: 2,
                        totalPages: 1,
                    });
                }
            },
        };

        const { getByLabelText, queryByText } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <ApiApplications id="api_1" />
            </DataProviderContext.Provider>,
            initialState
        );

        const appSelect = getByLabelText(
            'resources.apis.specification.actions.search_or_select_application'
        );

        // Show all applications when appSelect when no search criteria
        await wait(() => fireEvent.mouseDown(appSelect));
        expect(queryByText('application 1')).not.toBeNull();
        expect(queryByText('application 2')).not.toBeNull();
        expect(queryByText('application 3')).not.toBeNull();
        expect(queryByText('app 4')).not.toBeNull();
        expect(queryByText('app 5')).not.toBeNull();

        // Enter search criteria
        await wait(() =>
            fireEvent.change(appSelect, { target: { value: 'application' } })
        );
        expect(queryByText('application 1')).not.toBeNull();
        expect(queryByText('application 2')).not.toBeNull();
        expect(queryByText('application 3')).not.toBeNull();
        expect(queryByText('app 4')).toBeNull();
        expect(queryByText('app 5')).toBeNull();

        expect.assertions(10);
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
            getList: type => {
                if (type === 'applications') {
                    return Promise.resolve({
                        data: [
                            {
                                id: 1,
                                name: 'application 1',
                                apiKey: 'the_api_key',
                                keySecret: 'the_api_secret',
                            },
                        ],
                        total: 1,
                        totalPages: 1,
                    });
                } else if (type === 'apiKeys') {
                    return Promise.resolve({
                        data: [
                            {
                                apiKey: 1,
                                id: 1,
                                name: 'key 1',
                            },
                            {
                                apiKey: 2,
                                id: 2,
                                name: 'key 2',
                            },
                        ],
                        total: 2,
                        totalPages: 1,
                    });
                }
            },
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

        const appSelect = getByLabelText(
            'resources.apis.specification.actions.search_or_select_application'
        );
        const keySelect = getByLabelText(
            'resources.apis.specification.actions.select_api_key'
        );

        await wait(() => {
            fireEvent.mouseDown(appSelect);
            // Enter search criteria
            fireEvent.change(appSelect, { target: { value: 'application' } });
        });

        await wait(() => {
            expect(queryByText('application 1')).not.toBeNull();
        });

        fireEvent.click(getByText('application 1'));

        await wait(() => fireEvent.mouseDown(keySelect));

        expect(queryByText('key 1')).not.toBeNull();
        expect(queryByText('key 2')).not.toBeNull();

        fireEvent.click(getByText('key 1'));
    });
});
