// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState, useEffect } from 'react';
import {
    BooleanInput,
    email,
    FormDataConsumer,
    Labeled,
    maxLength,
    required,
    SaveButton,
    SimpleForm,
    TextField,
    TextInput,
    Toolbar,
    useCreatePath,
    useGetRecordId,
    useRecordContext,
    useTranslate,
    useUpdate,
} from 'react-admin';
import { Link, useNavigate } from 'react-router-dom';
import { Collapse } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import Button from '@mui/material/Button';
import get from 'lodash/get';

import { useApiHub } from '../ApiHubContext';
import { Edit, FormDialog, PasswordInput, ViewTitle } from '../ui';
import {
    fetchPasswordPolicyData,
    getPwdTooltip,
    usePasswordEncryption,
} from '../authentication';
import { UserProfileTitle } from './UserProfileTitle';
import { UserProfileSubtitle } from './UserProfileSubtitle';
import { isPortalAdmin, useUserContext } from '../userContexts';
import { useLayer7Notify } from '../useLayer7Notify';

export const UserProfileEdit = () => (
    <Edit title={<UserProfileTitle />} mutationMode="undoable">
        <UserProfileEditPage />
    </Edit>
);

const UserProfileEditPage = () => {
    const id = useGetRecordId();
    const translate = useTranslate();
    const [publicKey, encrypt] = usePasswordEncryption();
    const [currentPassword, setCurrentPassword] = useState('');
    const [showFormDialog, setShowFormDialog] = useState(false);
    const [savedFormData, setSavedFormData] = useState({});
    const { classes } = useUserProfileEditFormStyles();
    const [currentPwdError, setCurrentPwdError] = useState(false);
    const record = useRecordContext();
    const [update] = useUpdate();
    const navigate = useNavigate();
    const createPath = useCreatePath();
    const notify = useLayer7Notify();

    const handleSave = async formData => {
        const { newPassword, ...userProfile } = formData;
        // if currentPassword and newPassword are available, then user
        // is updating password
        // if only currentPassword is available, then user is updating email
        if (newPassword && currentPassword) {
            if (publicKey) {
                userProfile.newPassword = await encrypt(newPassword);
                userProfile.password = await encrypt(currentPassword);
                userProfile.publicKey = publicKey;
            } else {
                userProfile.newPassword = newPassword;
                userProfile.password = currentPassword;
            }
        } else if (currentPassword) {
            if (publicKey) {
                userProfile.password = await encrypt(currentPassword);
                userProfile.publicKey = publicKey;
            } else {
                userProfile.password = await encrypt(currentPassword);
            }
        }
        return await update(
            'userProfiles',
            {
                id,
                data: userProfile,
            },
            {
                returnPromise: true,
                onSuccess: () => {
                    navigate(
                        createPath({
                            resource: 'userProfiles',
                            type: 'show',
                            id,
                        })
                    );
                },
                onError: error => notify('Unable to authroize action', 'error'),
            }
        );
    };

    const handleSubmit = async formData => {
        const { email, newPassword, updatePassword } = formData;
        if (get(record, 'email') !== email || (updatePassword && newPassword)) {
            setSavedFormData(formData);
            setShowFormDialog(true);
        } else {
            await handleSave(formData);
        }
    };

    const handleFormDialogCancel = () => {
        setShowFormDialog(false);
        setCurrentPwdError(false);
        setCurrentPassword('');
    };

    const handleFormDialogSubmit = async () => {
        if (currentPassword) {
            setShowFormDialog(false);
            await handleSave(savedFormData);
        } else {
            setCurrentPwdError(true);
        }
    };

    const handleCurrentPasswordChange = event => {
        setCurrentPwdError(false);
        setCurrentPassword(event.target.value);
    };

    const modalFormValidate = ({ currentPassword }) => {
        const errors = {};
        if (!currentPassword) {
            errors.currentPassword =
                'resources.userProfiles.validation.error_password_empty';
        }
        return errors;
    };

    return (
        <>
            <ViewTitle />
            <UserProfileEditForm save={handleSubmit} />
            <FormDialog
                isOpen={showFormDialog}
                submitText={translate('resources.userProfiles.actions.submit')}
                cancelText={translate('resources.userProfiles.actions.cancel')}
                onSubmit={handleFormDialogSubmit}
                onCancel={handleFormDialogCancel}
                title={translate('resources.userProfiles.passwordDialogTitle')}
                submitButtonDisabled={false}
                isDialogContentText={false}
            >
                <SimpleForm
                    sanitizeEmptyValues={true}
                    toolbar={() => {}} // hide toolbar
                    validate={modalFormValidate}
                >
                    <PasswordInput
                        className={classes.field}
                        id={'currentPassword'}
                        name={'currentPassword'}
                        value={currentPassword}
                        fullWidth
                        helperText="resources.userProfiles.validation.tooltip_current_password"
                        label="resources.userProfiles.passwordDialogTitle"
                        error={currentPwdError}
                        onChange={handleCurrentPasswordChange}
                        variant="filled"
                        style={{
                            width: 448,
                        }}
                    />
                </SimpleForm>
            </FormDialog>
        </>
    );
};

const CancelButton = ({ disabled }) => {
    const translate = useTranslate();
    const id = useGetRecordId();
    const createPath = useCreatePath();

    return (
        <Button
            component={Link}
            to={createPath({ resource: 'userProfiles', id, type: 'show' })}
            variant="outlined"
            disabled={disabled}
        >
            {translate('resources.userProfiles.actions.cancel')}
        </Button>
    );
};

const useUserProfileEditToolbarStyles = makeStyles({
    name: 'Layer7UserContextEditToolbar',
})(theme => ({
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

const UserProfileEditToolbar = () => {
    const { classes } = useUserProfileEditToolbarStyles();
    const [userContext] = useUserContext();
    const isIdpUser = get(userContext, 'userDetails.isIdpUser', false);
    return (
        <Toolbar className={classes.toolbar}>
            <CancelButton disabled={isIdpUser} />
            <SaveButton disabled={isIdpUser} className={classes.saveButton} />
        </Toolbar>
    );
};

const useUserProfileEditFormStyles = makeStyles({
    name: 'Layer7UserProfileEditForm',
})(theme => ({
    root: {
        padding: `${theme.spacing(2)} !important`,
        width: 480,
    },
    field: {
        display: 'block',
    },
}));

const validateName = [required(), maxLength(60)];
const validateEmail = [required(), maxLength(256), email()];

export const UserProfileEditForm = ({ save, ...rest }) => {
    const { classes } = useUserProfileEditFormStyles();
    const [userContext] = useUserContext();
    const isAdmin = isPortalAdmin(userContext);
    const [passwordPolicyData, setPasswordPolicyData] = useState({});
    const { urlWithTenant, originHubName } = useApiHub();
    useEffect(() => {
        fetchPasswordPolicyData(urlWithTenant, originHubName)
            .then(data => {
                setPasswordPolicyData(data);
            })
            .catch(exception => {
                setPasswordPolicyData({});
            });
    }, [originHubName, urlWithTenant]);
    const regexConfig = get(passwordPolicyData, 'regexConfig', {});
    const regexStr = get(regexConfig, 'REGEX.value', '');
    const translate = useTranslate();
    const passwordTooltip = getPwdTooltip(regexConfig, translate);
    const isIdpUser = get(userContext, 'userDetails.isIdpUser', false);
    const validate = ({ newPassword, confirmNewPassword, updatePassword }) => {
        const errors = {};
        if (updatePassword) {
            const strReg = new RegExp(regexStr);
            if (!strReg.test(newPassword)) {
                errors.newPassword = passwordTooltip;
            }
            if (!strReg.test(confirmNewPassword)) {
                errors.confirmNewPassword = passwordTooltip;
            }
            if (newPassword) {
                if (newPassword !== confirmNewPassword) {
                    errors.confirmNewPassword =
                        'resources.userProfiles.validation.error_password_match';
                }
            }
            if (!newPassword) {
                errors.newPassword =
                    'resources.userProfiles.validation.error_password_empty';
            }
        }
        return errors;
    };

    return (
        <SimpleForm
            sanitizeEmptyValues={true}
            className={classes.root}
            // decorators={[pwdResetDecorator]}
            onSubmit={save}
            toolbar={<UserProfileEditToolbar />}
            validate={validate}
            {...rest}
        >
            <Labeled>
                <TextField className={classes.field} source="userName" />
            </Labeled>
            <TextInput
                className={classes.field}
                fullWidth
                source="lastName"
                validate={validateName}
                disabled={isIdpUser}
            />
            <TextInput
                className={classes.field}
                fullWidth
                source="firstName"
                validate={validateName}
                disabled={isIdpUser}
            />
            <TextInput
                className={classes.field}
                fullWidth
                source="email"
                validate={validateEmail}
                readOnly={!isAdmin || isIdpUser}
            />
            {!isIdpUser && <UserProfileSubtitle />}
            {!isIdpUser && (
                <BooleanInput
                    className={classes.field}
                    fullWidth
                    source="updatePassword"
                />
            )}
            {!isIdpUser && (
                <FormDataConsumer>
                    {({ formData, className, ...rest }) => (
                        <Collapse in={formData.updatePassword}>
                            <PasswordInput
                                fullWidth
                                source="newPassword"
                                style={{
                                    width: 448,
                                }}
                                title={passwordTooltip}
                                data-testid={'new-password'}
                                className={className}
                                {...rest}
                            />
                            <br />
                            <PasswordInput
                                fullWidth
                                source="confirmNewPassword"
                                style={{
                                    width: 448,
                                }}
                                title="resources.userProfiles.validation.tooltip_password_confirm"
                                data-testid={'confirm-new-password'}
                                className={className}
                                {...rest}
                            />
                        </Collapse>
                    )}
                </FormDataConsumer>
            )}
        </SimpleForm>
    );
};
