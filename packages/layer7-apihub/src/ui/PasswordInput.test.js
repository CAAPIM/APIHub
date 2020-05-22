import React from 'react';
import { SimpleForm } from 'react-admin';
import { renderWithRedux } from 'ra-core';
import expect from 'expect';

import { PasswordInput } from './PasswordInput';
import { fireEvent } from '@testing-library/react';

describe('PasswordInput', () => {
    test('should render a password input by default', () => {
        const { getByLabelText } = renderWithRedux(
            <SimpleForm resource="accounts">
                <PasswordInput source="password" />
            </SimpleForm>
        );

        const input = getByLabelText('resources.accounts.fields.password');
        expect(input.getAttribute('type')).toEqual('password');
    });

    test('should allow to see the password', () => {
        const { getByLabelText } = renderWithRedux(
            <SimpleForm resource="accounts">
                <PasswordInput source="password" />
            </SimpleForm>
        );

        const input = getByLabelText('resources.accounts.fields.password');
        const button = getByLabelText('ra.input.password.toggle_hidden');
        fireEvent.click(button);
        expect(input.getAttribute('type')).toEqual('text');
    });

    test('should display the tooltip if provided', () => {
        const { queryByLabelText } = renderWithRedux(
            <SimpleForm resource="accounts">
                <PasswordInput source="password" title="I'm a tooltip" />
            </SimpleForm>
        );

        const tooltip = queryByLabelText("I'm a tooltip");
        expect(tooltip).not.toBeNull();
    });
});
