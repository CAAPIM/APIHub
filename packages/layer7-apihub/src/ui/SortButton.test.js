// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { changeListParams } from 'ra-core';
import { SortButton, SortMenuItem } from './SortButton';
import { AdminContext } from 'react-admin';

describe('SortButton', () => {
    test('should display the current sort as its label', () => {
        const { findByText } = render(
            <AdminContext>
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
            </AdminContext>
        );

        expect(findByText('Current sort')).not.toBeNull();
    });
    test.skip('should allow to change the current sort', () => {
        let dispatchSpy;
        let historySpy;
        const resource = 'apis';

        const { findByText } = render(
            <AdminContext
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
            </AdminContext>
        );

        fireEvent.click(screen.findByText('Current sort'));
        fireEvent.click(screen.findByText('Not current sort'));

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
