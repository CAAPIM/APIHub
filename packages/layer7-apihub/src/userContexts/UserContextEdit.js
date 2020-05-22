import React, { useCallback } from 'react';
import {
    fetchUtils,
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
    useNotify,
} from 'react-admin';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import { ViewTitle, PasswordInput } from '../ui';
import { useApiHub } from '../ApiHubContext';
import { usePasswordEncryption, validatePassword } from '../authentication';
import { UserContextTitle } from './UserContextTitle';
import { UserContextSubtitle } from './UserContextSubtitle';

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

const useUserContextEditToolbarStyles = makeStyles(theme => ({
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
}));

const UserContextEditToolbar = ({ record, ...rest }) => {
    const classes = useUserContextEditToolbarStyles();

    return (
        <Toolbar className={classes.toolbar} record={record} {...rest}>
            <CancelButton />
            <SaveButton className={classes.saveButton} redirect="show" />
        </Toolbar>
    );
};

const useUserContextEditStyles = makeStyles(theme => ({
    root: {
        padding: `${theme.spacing(2)}px !important`,
    },
    field: {
        width: 456,
    },
}));

const validateName = [required(), maxLength(60)];
const validateEmail = [required(), maxLength(256), email()];

export const UserContextEditForm = ({ record, basePath, save, ...rest }) => {
    const classes = useUserContextEditStyles();

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
    const { url } = useApiHub();
    const notify = useNotify();
    const [publicKey, encrypt] = usePasswordEncryption();
    const uuid = user?.uuid;

    return useCallback(
        async ({ currentPassword, newPassword }) => {
            let finalPassword = currentPassword;
            let finalNewPassword = newPassword;

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
            }

            // This is need to get a special cookie required for password change
            await fetch(`${url}/admin/sessionCheck`, {
                credentials: 'include',
            });

            return fetchUtils
                .fetchJson(`${url}/admin/v2/users/password/change`, {
                    credentials: 'include',
                    body: JSON.stringify({
                        password: finalPassword,
                        newPassword: finalNewPassword,
                        uuid,
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
                            'resources.userContexts.notifications.invalid_password',
                            'warning'
                        );
                    }
                    notify(
                        'resources.userContexts.notifications.update_error',
                        'warning'
                    );
                });
        },
        [encrypt, notify, publicKey, url, uuid]
    );
};
