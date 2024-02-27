import React, { useState, useEffect } from 'react';
import {
    PasswordInput,
    required,
    SimpleForm,
    TextInput,
    useLogin,
    useTranslate,
} from 'react-admin';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { makeStyles, Link, Typography } from '@material-ui/core';
import get from 'lodash/get';
import { AuthSchemeList, LoginToolbar } from '.';
import { useAuthSchemes, usePasswordEncryption } from '..';

export const LoginForm = props => {
    const { toolbarProps, isShowingMultiSessionPrompt, localLoginsDisabled, setIsShowingMultiSessionPrompt, ...rest } = props;

    const login = useLogin();
    const classes = useStyles(rest);
    const translate = useTranslate();
    const location = useLocation();
    const [
        authSchemes,
        defaultAuthScheme,
        defaultEnhancedPasswordSecurity,
    ] = useAuthSchemes(location);
    const [publicKey, encrypt] = usePasswordEncryption();

    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState(null);
    const [authScheme, setAuthScheme] = useState(null);
    const [multiSessionUserName, setMultiSessionUserName] = useState('');

	useEffect(() => {
		setAuthScheme(defaultAuthScheme);
	}, [defaultAuthScheme]);

    const submit = async ({ confirmpassword, username, password }) => {
        setError(null);
        setIsLoading(true);

        const currentPassword = isShowingMultiSessionPrompt ? confirmpassword : password;

        const params = {
            scheme: 'credentials',
            provider: get(authScheme, 'uuid', null),
            username : isShowingMultiSessionPrompt ? multiSessionUserName : username,
            password : currentPassword,
            ...(isShowingMultiSessionPrompt && { terminateExistingSessions: true }),
        };
        const enhancedPasswordSecurity = authScheme
            ? get(
                  authScheme,
                  'advancedConfigurations.enhancedPasswordSecurity'
              ) === 'yes'
            : defaultEnhancedPasswordSecurity;
        if (enhancedPasswordSecurity && publicKey) {
            params.password = await encrypt(currentPassword);
            params.publicKey = publicKey;
        }

        let errorMessageObjString = '';
        let errorOccured = false;
        try {
            if(!params.provider && localLoginsDisabled) {
                setError('apihub.login.notifications.local_logins_disabled');
            } else {
                await login(params);
            }
        } catch(error) {
            console.error(error.message);
            errorOccured = true;
            errorMessageObjString = error.message;
        }
        if (errorOccured) {
            let responseCode = '';
            if (errorMessageObjString) {
                try {
                    let errorObj = JSON.parse(errorMessageObjString);
                    responseCode = get(errorObj, 'body.respCode', '');
                }
                catch(parseError) {
                }
            }
            if (responseCode === '14007') {
                setIsShowingMultiSessionPrompt(true);
                setMultiSessionUserName(username);
            } else if (isShowingMultiSessionPrompt && (responseCode === '14002')) {
                setError('apihub.login.notifications.multi_session_invalid_credentials');
            } else {
                setError('apihub.login.notifications.invalid_credentials');
            }
        }

        setIsLoading(false);
    };

    if (defaultAuthScheme && !defaultAuthScheme.credsReqd) {
        window.location = defaultAuthScheme.url;
        return;
    }

    let credsReqd = !localLoginsDisabled || authScheme;
    const saveLabel = isShowingMultiSessionPrompt ? 'apihub.login.actions.multi_session_sign_in' : 'apihub.login.actions.sign_in';
    const saveBtnAdditionalText = isShowingMultiSessionPrompt ? translate('apihub.login.actions.multi_session_sign_in_additional_text') : '';
    const handleCancel = () => {
        setIsShowingMultiSessionPrompt(false);
    };

    const renderNormalForm = () => (<SimpleForm
        className={classes.form}
        save={submit}
        toolbar={
            <LoginToolbar
                loading={isLoading}
                error={error}
                handleCancel={handleCancel}
                saveLabel={saveLabel}
                saveBtnAdditionalText={saveBtnAdditionalText}
                showCancelBtn={isShowingMultiSessionPrompt}
                {...toolbarProps}
            />
        }
        {...props}
    >
        <TextInput
            source="username"
            type="text"
            label="apihub.login.fields.username"
            variant="outlined"
            fullWidth
            validate={required()}
        />
        <PasswordInput
            source="password"
            label="apihub.login.fields.password"
            variant="outlined"
            fullWidth
            validate={required()}
        />
    </SimpleForm>);

    const renderMultipleSessionConfirmForm = () => (<SimpleForm
        className={classes.form}
        save={submit}
        toolbar={
            <LoginToolbar
                loading={isLoading}
                error={error}
                handleCancel={handleCancel}
                saveLabel={saveLabel}
                saveBtnAdditionalText={saveBtnAdditionalText}
                showCancelBtn={isShowingMultiSessionPrompt}
                {...toolbarProps}
            />
        }
        {...props}
    >
        {isShowingMultiSessionPrompt && <PasswordInput
            source="confirmpassword"
            label="apihub.login.fields.password"
            variant="outlined"
            fullWidth
            validate={required()}
        />}
    </SimpleForm>);

    return (
        <>
          { credsReqd && ( isShowingMultiSessionPrompt ? renderMultipleSessionConfirmForm() : renderNormalForm() ) }
            {(!isShowingMultiSessionPrompt && !localLoginsDisabled) ? (
            <Typography variant="body1">
                <Link component={RouterLink} to="/reset-password">
                    {translate('apihub.login.actions.forgot_password')}
                </Link>
            </Typography>
            ) : null}
            {(!isShowingMultiSessionPrompt && (authSchemes.length > 0)) ? (
                <AuthSchemeList
                    onClick={setAuthScheme}
                    authSchemes={authSchemes}
                    defaultAuthScheme={defaultAuthScheme}
                    credsReqd={credsReqd}
                />
            ) : null}
        </>
    );
};

const useStyles = makeStyles(
    theme => ({
        form: {
            '& >:first-child': {
                padding: 0,
            },
        },
        multi_session_btn: {
            fontSize: 14,
            fontWeight: 600,
        },
    }),
    {
        name: 'Layer7LoginForm',
    }
);
