// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { AdminContext, SimpleForm } from 'react-admin';
import { CustomFieldInput } from './CustomFieldInput';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('CustomFieldInput', () => {
    test('should return a TextInput if the CustomField type is TEXT', () => {
        const customField = {
            id: '0e93c523-ca24-46e4-bd0d-20fd361e205c',
            name: 'custom-text-field',
            status: 'ENABLED',
            required: false,
            description: 'A custom text field',
            type: 'TEXT',
            entityType: 'APPLICATION',
        };

        const { findByText } = render(
            <AdminContext>
                <SimpleForm sanitizeEmptyValues={true} toolbar={<></>}>
                    <CustomFieldInput customField={customField} />
                </SimpleForm>
            </AdminContext>
        );

        const input = findByText('custom-text-field');
        //expect(input.type).toEqual('text');
        //expect(input.id).toEqual('custom-text-field');
    });

    test.skip('should correctly apply validation on text field', () => {
        const customField = {
            name: 'custom-text-field',
            id: '0e93c523-ca24-46e4-bd0d-20fd361e205c',
            status: 'ENABLED',
            required: true,
            description: 'A custom text field',
            type: 'TEXT',
            entityType: 'APPLICATION',
        };

        const { findByText } = render(
            <AdminContext>
                <SimpleForm sanitizeEmptyValues={true}>
                    <CustomFieldInput customField={customField} />
                </SimpleForm>
            </AdminContext>
        );

        const input = findByText('A custom text field *');
        expect(input).not.toBeNull();
    });

    test.skip('should return a SelectInput if the CustomField type is SINGLE_SELECT', async () => {
        const customField = {
            name: 'custom-select-field',
            id: 'bb683549-ddf4-4aad-9761-1e5cad981672',
            status: 'ENABLED',
            required: false,
            description: 'A custom select field',
            type: 'SINGLE_SELECT',
            entityType: 'APPLICATION',
            options: [
                {
                    value: 'Choice 2',
                    ordinal: 1,
                },
                {
                    value: 'Choice 1',
                    ordinal: 0,
                },
                {
                    value: 'Choice 3',
                    ordinal: 2,
                },
            ],
        };

        const { findByText } = render(
            <AdminContext>
                <SimpleForm sanitizeEmptyValues={true} toolbar={<></>}>
                    <CustomFieldInput
                        source={customField.name}
                        customField={customField}
                    />
                </SimpleForm>
            </AdminContext>
        );

        const input = findByText('custom-select-field');
        await userEvent.click(input);
        expect(findByText('Choice 1')).toBeVisible();
        expect(findByText('Choice 2')).toBeVisible();
        expect(findByText('Choice 3')).toBeVisible();
    });

    test.skip('should correctly apply validation on select field', () => {
        const customField = {
            name: 'custom-select-field',
            uuid: 'bb683549-ddf4-4aad-9761-1e5cad981672',
            status: 'ENABLED',
            required: true,
            description: 'A custom select field',
            type: 'SINGLE_SELECT',
            entityType: 'APPLICATION',
            options: [
                {
                    value: 'Choice 2',
                    ordinal: 1,
                },
                {
                    value: 'Choice 1',
                    ordinal: 0,
                },
                {
                    value: 'Choice 3',
                    ordinal: 2,
                },
            ],
        };

        const { findByText } = render(
            <AdminContext>
                <SimpleForm sanitizeEmptyValues={true} toolbar={<></>}>
                    <CustomFieldInput
                        resource="application"
                        source={customField.name}
                        customField={customField}
                    />
                </SimpleForm>
            </AdminContext>
        );

        const input = findByText('custom-select-field *');
        expect(input).not.toBeNull();
    });
});
