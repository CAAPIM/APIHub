// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';

import { CardGrid } from './CardGrid';
import { AdminContext } from 'react-admin';

const ids = [1, 2, 3];
const data = {
    1: {
        name: 'test 1',
    },
    2: {
        name: 'test 2',
    },
    3: {
        name: 'test 3',
    },
};
describe('CardGrid', () => {
    test('should display as many cards as ids', () => {
        const Component = ({ record }) => <span>{record.name}</span>;

        const { findByText } = render(
            <AdminContext>
                <CardGrid ids={ids} data={data} loaded>
                    <Component />
                </CardGrid>
            </AdminContext>
        );

        expect(findByText('test 1')).not.toBeNull();
        expect(findByText('test 2')).not.toBeNull();
        expect(findByText('test 3')).not.toBeNull();
    });
});
