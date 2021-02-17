import React, { useCallback } from 'react';
import {
    EditView,
    SimpleForm,
    Toolbar,
    TextField,
    TextInput,
    EditButton,
    SaveButton,
    required,
    maxLength,
    email,
    useEditController,
    useTranslate,
} from 'react-admin';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import get from 'lodash/get';

import { useLayer7Notify } from '../useLayer7Notify';
import { ViewTitle, PasswordInput } from '../ui';
import { useApiHub } from '../ApiHubContext';
import { usePasswordEncryption, validatePassword } from '../authentication';
import { UserContextTitle } from './UserContextTitle';
import { UserContextSubtitle } from './UserContextSubtitle';
import { getFetchJson } from '../fetchUtils';

export const UserContextEdit = props => {
    const { record, save, ...editControllerProps } = useEditController({
        successMessage: 'resources.userContexts.notifications.update_success',
        ...props,
    });

    const updatePassword = useUpdatePassword(record);

    const handleSave = async formData => {
        const {
            currentPassword,
            newPassword,
            confirmNewPassword,
            ...userContext
        } = formData;

        const result = await save(userContext, 'show');

        if (currentPassword && newPassword && confirmNewPassword) {
            await updatePassword({ currentPassword, newPassword });
        }

        return result;
    };

    return (
        <>
            <ViewTitle />
            <EditView
                {...editControllerProps}
                title={<UserContextTitle actions={<EditButton disabled />} />}
                record={record}
                save={handleSave}
            >
                <UserContextEditForm />
            </EditView>
        </>
    );
};

const CancelButton = ({ record }) => {
    const translate = useTranslate();

    return (
        <Button
            component={Link}
            to={record ? `/userContexts/${record.id}/show` : ''}
            variant="outlined"
            color="primary"
        >
            {translate('resources.userContexts.actions.cancel')}
        </Button>
    );
};

const useUserContextEditToolbarStyles = makeStyles(
    theme => ({
        toolbar: {
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: 456,
        },
        saveButton: {
            marginLeft: theme.spacing(2),
        },
    }),
    {
        name: 'Layer7UserContextEditToolbar',
    }
);

const UserContextEditToolbar = ({ record, ...rest }) => {
    const classes = useUserContextEditToolbarStyles();

    return (
        <Toolbar className={classes.toolbar} record={record} {...rest}>
            <CancelButton />
            <SaveButton className={classes.saveButton} redirect="show" />
        </Toolbar>
    );
};

const useUserContextEditFormStyles = makeStyles(
    theme => ({
        root: {
            padding: `${theme.spacing(2)}px !important`,
        },
        field: {
            width: 456,
        },
    }),
    {
        name: 'Layer7UserContextEditForm',
    }
);

const validateName = [required(), maxLength(60)];
const validateEmail = [required(), maxLength(256), email()];

export const UserContextEditForm = ({ record, basePath, save, ...rest }) => {
    const classes = useUserContextEditFormStyles();

    const validate = ({ currentPassword, newPassword, confirmNewPassword }) => {
        const errors = {};

        if (newPassword) {
            if (!currentPassword) {
                errors.currentPassword =
                    'resources.userContexts.validation.error_current_password_empty';
            }
            if (newPassword !== confirmNewPassword) {
                errors.confirmNewPassword =
                    'resources.userContexts.validation.error_password_match';
            }
        }

        return errors;
    };

    return (
        <SimpleForm
            className={classes.root}
            record={record}
            save={save}
            toolbar={<UserContextEditToolbar />}
            validate={validate}
            {...rest}
        >
            <TextField
                className={classes.field}
                source="userDetails.username"
            />
            <TextInput
                className={classes.field}
                source="userDetails.lastName"
                validate={validateName}
            />
            <TextInput
                className={classes.field}
                source="userDetails.firstName"
                validate={validateName}
            />
            <TextInput
                className={classes.field}
                source="userDetails.email"
                validate={validateEmail}
            />
            <UserContextSubtitle />
            <PasswordInput
                source="currentPassword"
                title="resources.userContexts.validation.tooltip_password"
                className={classes.field}
            />
            <PasswordInput
                source="newPassword"
                title="resources.userContexts.validation.tooltip_password"
                className={classes.field}
                validate={validatePassword}
            />
            <PasswordInput
                source="confirmNewPassword"
                title="resources.userContexts.validation.tooltip_password_confirm"
                className={classes.field}
            />
        </SimpleForm>
    );
};

const useUpdatePassword = user => {
    const { url, urlWithTenant, originHubName } = useApiHub();
    const notify = useLayer7Notify();
    const [publicKey, encrypt] = usePasswordEncryption();
    const uuid = get(user, 'userDetails.uuid');

    return useCallback(
        async ({ currentPassword, newPassword }) => {
            let finalPassword = currentPassword;
            let finalNewPassword = newPassword;
            const headers = new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                Accept: 'text/plain, */*; q=0.01',
            });

            if (publicKey) {
                const [
                    encryptedPassword,
                    encryptedNewPassword,
                ] = await Promise.all([
                    encrypt(currentPassword),
                    encrypt(newPassword),
                ]);

                finalPassword = encryptedPassword;
                finalNewPassword = encryptedNewPassword;
                headers.set('Public-Key', publicKey);
            }

            const fetchJson = getFetchJson(originHubName);
            // This is need to get a special cookie required for password change
            await fetchJson(`${urlWithTenant}/sessionCheck`);

            return fetchJson(`${url}/admin/v2/users/password/change`, {
                credentials: 'include',
                headers: headers,
                body: JSON.stringify({
                    uuid: uuid,
                    password: finalPassword,
                    newPassword: finalNewPassword,
                }),
                method: 'PUT',
            })
                .then(() => {
                    notify(
                        'resources.userContexts.notifications.confirm_password_change'
                    );
                })
                .catch(error => {
                    if (error.status === 400) {
                        notify(
                            error ||
                                'resources.userContexts.notifications.invalid_password',
                            'error'
                        );
                    }
                    notify(
                        error ||
                            'resources.userContexts.notifications.update_error',
                        'error'
                    );
                });
        },
        [encrypt, notify, originHubName, publicKey, url, urlWithTenant, uuid]
    );
};
