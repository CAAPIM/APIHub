import React from 'react';
import expect from 'expect';
import { createAdminStore, TestTranslationProvider } from 'ra-core';
import { Notification } from 'react-admin';
import { render, fireEvent, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { UserContextEditForm } from './UserContextEdit';

const baseData = {
    id: 'layer7@currentUser',
    userDetails: {
        username: 'marmelab',
        lastName: 'Amoros',
        firstName: 'Adrien',
        email: 'adrien@marmelab.com',
    },
};

describe('UserContextEdit page', () => {
    const history = createMemoryHistory();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('UserContextEditForm', () => {
        const renderUserContextEditForm = ({
            data = baseData,
            ...props
        } = {}) => {
            const store = createAdminStore({
                history,
                initialState: {
                    admin: {
                        resources: {
                            userContexts: {
                                [data.id]: {
                                    ...data,
                                },
                            },
                        },
                    },
                },
            });

            const handleSave = jest.fn();

            return {
                store,
                save: handleSave,
                ...render(
                    <Provider store={store}>
                        <Router history={history}>
                            <TestTranslationProvider translate={key => key}>
                                <UserContextEditForm
                                    basePath="/userContexts"
                                    resource="userContexts"
                                    record={data}
                                    save={handleSave}
                                    {...props}
                                />
                                <Notification />
                            </TestTranslationProvider>
                        </Router>
                    </Provider>
                ),
            };
        };

        test('should fill the form with the user details', async () => {
            const { getByLabelText } = renderUserContextEditForm();

            // User Details

            expect(
                await getByLabelText(
                    'resources.userContexts.fields.userDetails.username'
                ).textContent
            ).toEqual('marmelab');
            expect(
                await getByLabelText(
                    'resources.userContexts.fields.userDetails.lastName *'
                ).value
            ).toEqual('Amoros');
            expect(
                await getByLabelText(
                    'resources.userContexts.fields.userDetails.firstName *'
                ).value
            ).toEqual('Adrien');
            expect(
                await getByLabelText(
                    'resources.userContexts.fields.userDetails.email *'
                ).value
            ).toEqual('adrien@marmelab.com');

            // Password

            expect(
                await getByLabelText(
                    'resources.userContexts.fields.currentPassword'
                ).value
            ).toEqual('');
            expect(
                await getByLabelText(
                    'resources.userContexts.fields.newPassword'
                ).value
            ).toEqual('');
            expect(
                await getByLabelText(
                    'resources.userContexts.fields.confirmNewPassword'
                ).value
            ).toEqual('');
        });

        test('should change the user details', async () => {
            const { save, getByLabelText } = renderUserContextEditForm();

            // Fill the form

            const lastName = await getByLabelText(
                'resources.userContexts.fields.userDetails.lastName *'
            );
            fireEvent.focus(lastName);
            fireEvent.change(lastName, { target: { value: 'Garcia' } });
            fireEvent.blur(lastName);

            const firstName = await getByLabelText(
                'resources.userContexts.fields.userDetails.firstName *'
            );
            fireEvent.focus(firstName);
            fireEvent.change(firstName, { target: { value: 'Gildas' } });
            fireEvent.blur(firstName);

            const email = await getByLabelText(
                'resources.userContexts.fields.userDetails.email *'
            );
            fireEvent.focus(email);
            fireEvent.change(email, {
                target: { value: 'gildas@marmelab.com' },
            });
            fireEvent.blur(email);

            // Submit

            fireEvent.click(getByLabelText('ra.action.save'));

            expect(save).toHaveBeenCalledWith(
                {
                    id: 'layer7@currentUser',
                    userDetails: {
                        username: 'marmelab',
                        lastName: 'Garcia',
                        firstName: 'Gildas',
                        email: 'gildas@marmelab.com',
                    },
                },
                'show'
            );
        });

        test('should validate the user details required fields', async () => {
            const { save, getByLabelText } = renderUserContextEditForm();

            // Fill the form

            const lastName = await getByLabelText(
                'resources.userContexts.fields.userDetails.lastName *'
            );
            fireEvent.focus(lastName);
            fireEvent.change(lastName, {
                target: {
                    value: '',
                },
            });
            fireEvent.blur(lastName);

            const firstName = await getByLabelText(
                'resources.userContexts.fields.userDetails.firstName *'
            );
            fireEvent.focus(firstName);
            fireEvent.change(firstName, {
                target: {
                    value: '',
                },
            });
            fireEvent.blur(firstName);

            const email = await getByLabelText(
                'resources.userContexts.fields.userDetails.email *'
            );
            fireEvent.focus(email);
            fireEvent.change(email, {
                target: {
                    value: '',
                },
            });
            fireEvent.blur(email);

            // Submit

            fireEvent.click(getByLabelText('ra.action.save'));

            // Validate lastName

            const lastNameInput = await getByLabelText(
                'resources.userContexts.fields.userDetails.lastName *'
            ).parentElement.parentElement;
            const lastNameValidation = await within(lastNameInput).getByText(
                'ra.validation.required'
            );
            expect(lastNameValidation).not.toBe(null);

            // Validate firstName

            const firstNameInput = await getByLabelText(
                'resources.userContexts.fields.userDetails.firstName *'
            ).parentElement.parentElement;
            const firstNameValidation = await within(firstNameInput).getByText(
                'ra.validation.required'
            );
            expect(firstNameValidation).not.toBe(null);

            // Validate email

            const emailInput = await getByLabelText(
                'resources.userContexts.fields.userDetails.email *'
            ).parentElement.parentElement;
            const emailValidation = await within(emailInput).getByText(
                'ra.validation.required'
            );
            expect(emailValidation).not.toBe(null);

            // Global validation

            expect(save).not.toHaveBeenCalled();
        });

        test('should validate the user details email field', async () => {
            const { save, getByLabelText } = renderUserContextEditForm();

            // Fill the form

            const email = await getByLabelText(
                'resources.userContexts.fields.userDetails.email *'
            );
            fireEvent.focus(email);
            fireEvent.change(email, {
                target: {
                    value: 'adrienmarmelab.com', // Missing @
                },
            });
            fireEvent.blur(email);

            // Submit

            fireEvent.click(getByLabelText('ra.action.save'));

            // Validate email

            const emailInput = await getByLabelText(
                'resources.userContexts.fields.userDetails.email *'
            ).parentElement.parentElement;
            const emailValidation = await within(emailInput).getByText(
                'ra.validation.email'
            );
            expect(emailValidation).not.toBe(null);

            // Global validation

            expect(save).not.toHaveBeenCalled();
        });

        test('should validate the user password fields', async () => {
            const { save, getByLabelText } = renderUserContextEditForm();

            // Fill the form

            const currentPassword = await getByLabelText(
                'resources.userContexts.fields.currentPassword'
            );
            fireEvent.focus(currentPassword);
            fireEvent.change(currentPassword, {
                target: {
                    value: '',
                },
            });
            fireEvent.blur(currentPassword);

            const newPassword = await getByLabelText(
                'resources.userContexts.fields.newPassword'
            );
            fireEvent.focus(newPassword);
            fireEvent.change(newPassword, {
                target: {
                    value: 'MySuperSecuredPassword@1',
                },
            });
            fireEvent.blur(newPassword);

            const confirmNewPassword = await getByLabelText(
                'resources.userContexts.fields.confirmNewPassword'
            );
            fireEvent.focus(confirmNewPassword);
            fireEvent.change(confirmNewPassword, {
                target: {
                    value: 'NotTheSame',
                },
            });
            fireEvent.blur(confirmNewPassword);

            // Submit

            fireEvent.click(getByLabelText('ra.action.save'));

            // Validate currentPassword

            const currentPasswordInput = await getByLabelText(
                'resources.userContexts.fields.currentPassword'
            ).parentElement.parentElement;
            const currentPasswordValidation = await within(
                currentPasswordInput
            ).getByText(
                'resources.userContexts.validation.error_current_password_empty'
            );
            expect(currentPasswordValidation).not.toBe(null);

            // Validate confirmNewPassword

            const confirmNewPasswordInput = await getByLabelText(
                'resources.userContexts.fields.confirmNewPassword'
            ).parentElement.parentElement;
            const confirmNewPasswordValidation = await within(
                confirmNewPasswordInput
            ).getByText(
                'resources.userContexts.validation.error_password_match'
            );
            expect(confirmNewPasswordValidation).not.toBe(null);

            // Global validation

            expect(save).not.toHaveBeenCalled();
        });
    });
});
