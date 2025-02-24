import React from 'react';
import { SimpleForm, renderWithRedux } from 'react-admin';
import { MemoryRouter as Router } from 'react-router';

import { CustomFieldInput } from './CustomFieldInput';
import { fireEvent, wait } from '@testing-library/react';

describe('CustomFieldInput', () => {
    test('should return a TextInput if the CustomField type is TEXT', () => {
        const customField = {
            name: 'custom-text-field',
            uuid: '0e93c523-ca24-46e4-bd0d-20fd361e205c',
            status: 'ENABLED',
            required: false,
            description: 'A custom text field',
            type: 'TEXT',
            entityType: 'APPLICATION',
        };

        const { getByLabelText } = renderWithRedux(
            <Router>
                <SimpleForm>
                    <CustomFieldInput
                        resource="application"
                        customField={customField}
                    />
                </SimpleForm>
            </Router>
        );

        const input = getByLabelText('custom-text-field');
        expect(input.type).toEqual('text');
        expect(input.id).toEqual('custom-text-field');
    });

    test.skip('should correctly apply validation on text field', () => {
        const customField = {
            name: 'custom-text-field',
            uuid: '0e93c523-ca24-46e4-bd0d-20fd361e205c',
            status: 'ENABLED',
            required: true,
            description: 'A custom text field',
            type: 'TEXT',
            entityType: 'APPLICATION',
        };

        const { getByLabelText } = renderWithRedux(
            <Router>
                <SimpleForm>
                    <CustomFieldInput
                        resource="application"
                        customField={customField}
                    />
                </SimpleForm>
            </Router>
        );

        const input = getByLabelText('A custom text field *');
        expect(input).not.toBeNull();
    });

    test('should return a SelectInput if the CustomField type is SINGLE_SELECT', () => {
        const customField = {
            name: 'custom-select-field',
            uuid: 'bb683549-ddf4-4aad-9761-1e5cad981672',
            status: 'ENABLED',
            required: false,
            description: 'A custom select field',
            type: 'SINGLE_SELECT',
            entityType: 'APPLICATION',
            options:[
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

        const { getByLabelText, getAllByRole } = renderWithRedux(
            <Router>
                <SimpleForm>
                    <CustomFieldInput
                        resource="application"
                        source={customField.name}
                        customField={customField}
                    />
                </SimpleForm>
            </Router>
        );

        const input = getByLabelText('custom-select-field');
        fireEvent.click(input);
        wait(() => {
            const choices = getAllByRole('option');
            expect(choices.map(choice => choice.innerText)).toEqual([
                'Choice 1',
                'Choice 2',
                'Choice 3',
            ]);
        });
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

        const { getByLabelText } = renderWithRedux(
            <Router>
                <SimpleForm>
                    <CustomFieldInput
                        resource="application"
                        source={customField.name}
                        customField={customField}
                    />
                </SimpleForm>
            </Router>
        );

        const input = getByLabelText('custom-select-field *');
        expect(input).not.toBeNull();
    });
});
