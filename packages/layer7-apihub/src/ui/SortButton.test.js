import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { changeListParams, TestContext } from 'ra-core';
import { SortButton, SortMenuItem } from './SortButton';

describe('SortButton', () => {
    test('should display the current sort as its label', () => {
        const { queryByLabelText } = render(
            <TestContext>
                <SortButton currentSort={{ field: 'name', order: 'DESC' }}>
                    <SortMenuItem
                        label="Not current sort"
                        sort={{ field: 'name', order: 'ASC' }}
                    />
                    <SortMenuItem
                        label="Current sort"
                        sort={{ field: 'name', order: 'DESC' }}
                    />
                </SortButton>
            </TestContext>
        );

        expect(queryByLabelText('Current sort')).not.toBeNull();
    });
    test('should allow to change the current sort', () => {
        let dispatchSpy;
        let historySpy;
        const resource = 'apis';

        const { getByLabelText, getByText } = render(
            <TestContext
                initialState={{
                    admin: {
                        resources: {
                            apis: {
                                list: {
                                    params: {
                                        page: 2,
                                        perPage: 25,
                                        filter: { name: 'foo' },
                                    },
                                },
                            },
                        },
                    },
                }}
            >
                {({ store, history }) => {
                    dispatchSpy = jest.spyOn(store, 'dispatch');
                    historySpy = jest.spyOn(history, 'push');

                    return (
                        <SortButton
                            currentSort={{ field: 'name', order: 'DESC' }}
                            resource={resource}
                        >
                            <SortMenuItem
                                label="Not current sort"
                                sort={{ field: 'name', order: 'ASC' }}
                            />
                            <SortMenuItem
                                label="Current sort"
                                sort={{ field: 'name', order: 'DESC' }}
                            />
                        </SortButton>
                    );
                }}
            </TestContext>
        );

        fireEvent.click(getByLabelText('Current sort'));
        fireEvent.click(getByText('Not current sort'));

        expect(dispatchSpy).toHaveBeenCalledWith(
            changeListParams(resource, {
                page: 2,
                perPage: 25,
                filter: { name: 'foo' },
                sort: 'name',
                order: 'ASC',
            })
        );
        expect(historySpy).toHaveBeenCalledWith({
            search: `?filter=%7B%22name%22%3A%22foo%22%7D&order=ASC&page=2&perPage=25&sort=name`,
        });
    });
});
