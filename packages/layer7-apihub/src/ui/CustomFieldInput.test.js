import React from 'react';
import { SimpleForm, renderWithRedux } from 'react-admin';
import { MemoryRouter as Router } from 'react-router';

import { CustomFieldInput } from './CustomFieldInput';
import { fireEvent, wait } from '@testing-library/react';

describe('CustomFieldInput', () => {
    test('should return a TextInput if the CustomField type is TEXT', () => {
        const customField = {
            Name: 'custom-text-field',
            Uuid: '0e93c523-ca24-46e4-bd0d-20fd361e205c',
            Status: 'ENABLED',
            Required: false,
            Description: 'A custom text field',
            Type: 'TEXT',
            EntityType: 'APPLICATION',
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
            Name: 'custom-text-field',
            Uuid: '0e93c523-ca24-46e4-bd0d-20fd361e205c',
            Status: 'ENABLED',
            Required: true,
            Description: 'A custom text field',
            Type: 'TEXT',
            EntityType: 'APPLICATION',
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
            Name: 'custom-select-field',
            Uuid: 'bb683549-ddf4-4aad-9761-1e5cad981672',
            Status: 'ENABLED',
            Required: false,
            Description: 'A custom select field',
            Type: 'SINGLE_SELECT',
            EntityType: 'APPLICATION',
            OptionsList: {
                results: [
                    {
                        Value: 'Choice 2',
                        Ordinal: 1,
                    },
                    {
                        Value: 'Choice 1',
                        Ordinal: 0,
                    },
                    {
                        Value: 'Choice 3',
                        Ordinal: 2,
                    },
                ],
            },
        };

        const { getByLabelText, getAllByRole } = renderWithRedux(
            <Router>
                <SimpleForm>
                    <CustomFieldInput
                        resource="application"
                        source={customField.Name}
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
            Name: 'custom-select-field',
            Uuid: 'bb683549-ddf4-4aad-9761-1e5cad981672',
            Status: 'ENABLED',
            Required: true,
            Description: 'A custom select field',
            Type: 'SINGLE_SELECT',
            EntityType: 'APPLICATION',
            OptionsList: {
                results: [
                    {
                        Value: 'Choice 2',
                        Ordinal: 1,
                    },
                    {
                        Value: 'Choice 1',
                        Ordinal: 0,
                    },
                    {
                        Value: 'Choice 3',
                        Ordinal: 2,
                    },
                ],
            },
        };

        const { getByLabelText } = renderWithRedux(
            <Router>
                <SimpleForm>
                    <CustomFieldInput
                        resource="application"
                        source={customField.Name}
                        customField={customField}
                    />
                </SimpleForm>
            </Router>
        );

        const input = getByLabelText('custom-select-field *');
        expect(input).not.toBeNull();
    });
});
