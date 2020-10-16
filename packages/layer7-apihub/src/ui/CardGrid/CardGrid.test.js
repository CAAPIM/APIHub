import React from 'react';
import expect from 'expect';
import { renderWithRedux } from 'ra-core';

import { CardGrid } from './CardGrid';

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

        const { queryByText } = renderWithRedux(
            <CardGrid ids={ids} data={data} loaded>
                <Component />
            </CardGrid>
        );

        expect(queryByText('test 1')).not.toBeNull();
        expect(queryByText('test 2')).not.toBeNull();
        expect(queryByText('test 3')).not.toBeNull();
    });
});
