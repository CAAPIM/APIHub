// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { AdminContext, SimpleForm } from 'react-admin';
import expect from 'expect';

import { PasswordInput } from './PasswordInput';
import { fireEvent, render } from '@testing-library/react';

describe('PasswordInput', () => {
    test('should render a password input by default', () => {
        const { findByText } = render(
            <AdminContext>
                <SimpleForm toolbar={<></>} resource="accounts">
                    <PasswordInput source="password" />
                </SimpleForm>
            </AdminContext>
        );

        const input = findByText('resources.accounts.fields.password');
        //expect(input.getAttribute('type')).toEqual('password');
    });

    test.skip('should allow to see the password', () => {
        const { findByText } = render(
            <AdminContext>
                <SimpleForm resource="accounts" toolbar={<></>}>
                    <PasswordInput source="password" />
                </SimpleForm>
            </AdminContext>
        );

        const input = findByText('resources.accounts.fields.password');
        const button = findByText('ra.input.password.toggle_hidden');
        fireEvent.click(button);
        expect(input.getAttribute('type')).toEqual('text');
    });

    test('should display the tooltip if provided', () => {
        const { findByText } = render(
            <AdminContext>
                <SimpleForm toolbar={<></>}>
                    <PasswordInput source="password" title="I'm a tooltip" />
                </SimpleForm>
            </AdminContext>
        );

        const tooltip = findByText("I'm a tooltip");
        expect(tooltip).not.toBeNull();
    });
});
