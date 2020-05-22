import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import expect from 'expect';

import { ListDisplayButton } from './ListDisplayButton';
import {
    ListDisplayProvider,
    useListDisplay,
    LIST_DISPLAY_CARDS,
    LIST_DISPLAY_DATAGRID,
} from './ListDisplayContext';

describe('ListDisplayButton', () => {
    test('should display a button for each available display', () => {
        const { queryByLabelText } = render(
            <ListDisplayProvider>
                <ListDisplayButton />
            </ListDisplayProvider>
        );

        expect(queryByLabelText('apihub.actions.view_as_cards')).not.toBeNull();
        expect(queryByLabelText('apihub.actions.view_as_list')).not.toBeNull();
    });

    test('should allow to change the selected display', () => {
        const Component = () => {
            const [display] = useListDisplay();

            return <span>{display}</span>;
        };

        const { getByLabelText, queryByText } = render(
            <ListDisplayProvider>
                <ListDisplayButton />
                <Component />
            </ListDisplayProvider>
        );

        expect(queryByText(LIST_DISPLAY_CARDS)).not.toBeNull();
        fireEvent.click(getByLabelText('apihub.actions.view_as_list'));
        expect(queryByText(LIST_DISPLAY_DATAGRID)).not.toBeNull();
    });
});
