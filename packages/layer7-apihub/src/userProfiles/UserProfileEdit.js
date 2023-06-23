import React, { useState } from 'react';
import {
    BooleanInput,
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
    FormDataConsumer,
} from 'react-admin';
import { Link } from 'react-router-dom';
import { makeStyles, Collapse } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import createDecorator from 'final-form-calculate';
import get from 'lodash/get';

import { useApiHub } from '../ApiHubContext';
import { FormDialog, ViewTitle, PasswordInput } from '../ui';
import { usePasswordEncryption, fetchPasswordPolicyData, getPwdTooltip, getPasswordValidators } from '../authentication';
import { UserProfileTitle } from './UserProfileTitle';
import { UserProfileSubtitle } from './UserProfileSubtitle';
import { isPortalAdmin, useUserContext } from '../userContexts';

export const UserProfileEdit = props => {
    const { record, save, ...editControllerProps } = useEditController({
        successMessage: 'resources.userProfiles.notifications.update_success',
        ...props,
    });
    const translate = useTranslate();
    const [publicKey, encrypt] = usePasswordEncryption();
    const [currentPassword, setCurrentPassword] = useState('');
    const [showFormDialog, setShowFormDialog] = useState(false);
    const [savedFormData, setSavedFormData] = useState({});
    const classes = useUserProfileEditFormStyles();
    const [currentPwdError, setCurrentPwdError] = useState(false);

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
        const result = await save(userProfile, 'show');
        return result;
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

    const handleFormDialogFormSubmit = async event => {
        event.preventDefault();
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

    // workaround to hide form toolbar in formdialog
    const EmptyDiv = () => <div />;

    // specified those props to avoid errors in console
    const ToolbarCustomEmptyDiv = ({
        handleSubmit,
        handleSubmitWithRedirect,
        onSave,
        invalid,
        pristine,
        saving,
        submitOnEnter,
        ...rest
    }) => <EmptyDiv {...rest} />;

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
            <EditView
                undoable={false}
                {...editControllerProps}
                title={<UserProfileTitle actions={<EditButton disabled />} />}
                record={record}
                save={handleSubmit}
            >
                <UserProfileEditForm />
            </EditView>
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
                    toolbar={<ToolbarCustomEmptyDiv />}
                    validate={modalFormValidate}
                    onSubmit={handleFormDialogFormSubmit}
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

const CancelButton = ({ record }) => {
    const translate = useTranslate();

    return (
        <Button
            component={Link}
            to={record ? `/userProfiles/${record.id}/show` : ''}
            variant="outlined"
            color="primary"
        >
            {translate('resources.userProfiles.actions.cancel')}
        </Button>
    );
};

const useUserProfileEditToolbarStyles = makeStyles(
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

const UserProfileEditToolbar = ({ record, ...rest }) => {
    const classes = useUserProfileEditToolbarStyles();
    const [userContext] = useUserContext();
    const isIdpUser = get(userContext, 'userDetails.isIdpUser', false);
    return (
        <Toolbar className={classes.toolbar} record={record} {...rest}>
            <CancelButton disabled={isIdpUser} />
            <SaveButton
                disabled={isIdpUser}
                className={classes.saveButton}
                redirect="show"
            />
        </Toolbar>
    );
};

const useUserProfileEditFormStyles = makeStyles(
    theme => ({
        root: {
            padding: `${theme.spacing(2)}px !important`,
            width: 480,
        },
        field: {
            display: 'block',
        },
    }),
    {
        name: 'Layer7UserProfileEditForm',
    }
);

const validateName = [required(), maxLength(60)];
const validateEmail = [required(), maxLength(256), email()];

const pwdResetDecorator = createDecorator({
    field: 'updatePassword', // when updatePassword changes...
    updates: {
        // ...clear new password and verified password if updatePassword is false
        newPassword: (updatePasswordValue, allValues) =>
            updatePasswordValue ? allValues.newPassword : '',
        confirmNewPassword: (updatePasswordValue, allValues) =>
            updatePasswordValue ? allValues.confirmNewPassword : '',
    },
});

export const UserProfileEditForm = ({ record, basePath, save, ...rest }) => {
    const classes = useUserProfileEditFormStyles();

    const validate = ({ newPassword, confirmNewPassword, updatePassword }) => {
        const errors = {};

        if (updatePassword && newPassword) {
            if (newPassword !== confirmNewPassword) {
                errors.confirmNewPassword =
                    'resources.userProfiles.validation.error_password_match';
            }
        }

        if (updatePassword && !newPassword) {
            errors.newPassword =
                'resources.userProfiles.validation.error_password_empty';
        }

        return errors;
    };
    const [userContext] = useUserContext();
    const isAdmin = isPortalAdmin(userContext);
    const [passwordPolicyData, setPasswordPolicyData] = React.useState({});
    const { urlWithTenant, originHubName } = useApiHub();
    React.useEffect(() => {
        fetchPasswordPolicyData(urlWithTenant, originHubName).then(data => {
            setPasswordPolicyData(data);
        }).catch((exception) => {
            setPasswordPolicyData({});
        });
    }, []);
    const regexConfig = get(passwordPolicyData, 'regexConfig', {});
    const regexStr = get(regexConfig, 'REGEX.value', '');
    const translate = useTranslate();
    const passwordTooltip = getPwdTooltip(regexConfig, translate);
    const isIdpUser = get(userContext, 'userDetails.isIdpUser', false);
    return (
        <SimpleForm
            className={classes.root}
            decorators={[pwdResetDecorator]}
            record={record}
            save={save}
            toolbar={<UserProfileEditToolbar />}
            validate={validate}
            {...rest}
        >
            <TextField className={classes.field} fullWidth source="userName" />
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
                disabled={!isAdmin || isIdpUser}
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
                                validate={getPasswordValidators(regexStr)}
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
