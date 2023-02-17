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
    const { toolbarProps,localLoginsDisabled, ...rest } = props;

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

	useEffect(() => {
		setAuthScheme(defaultAuthScheme);
	}, [defaultAuthScheme]);

    const submit = async ({ username, password }) => {
        setError(null);
        setIsLoading(true);

        const params = {
            scheme: 'credentials',
            provider: get(authScheme, 'uuid', null),
            username,
            password,
        };
        const enhancedPasswordSecurity = authScheme
            ? get(
                  authScheme,
                  'advancedConfigurations.enhancedPasswordSecurity'
              ) === 'yes'
            : defaultEnhancedPasswordSecurity;
        if (enhancedPasswordSecurity && publicKey) {
            params.password = await encrypt(password);
            params.publicKey = publicKey;
        }

        try {
            if(!params.provider && localLoginsDisabled) {
                setError('apihub.login.notifications.local_logins_disabled');
            } else {
                await login(params);
            }
        } catch(error) {
            console.error(error.message);
            setError('apihub.login.notifications.invalid_credentials');
        }

        setIsLoading(false);
    };

    if (defaultAuthScheme && !defaultAuthScheme.credsReqd) {
        window.location = defaultAuthScheme.url;
        return;
    }

    let credsReqd = !localLoginsDisabled || authScheme;

    return (
        <>
          { credsReqd && (
            <SimpleForm
                className={classes.form}
                save={submit}
                toolbar={
                    <LoginToolbar
                        loading={isLoading}
                        error={error}
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
            </SimpleForm> ) }
            { !localLoginsDisabled ? (
            <Typography variant="body1">
                <Link component={RouterLink} to="/reset-password">
                    {translate('apihub.login.actions.forgot_password')}
                </Link>
            </Typography>
            ) : null}
            {authSchemes.length > 0 ? (
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
    }),
    {
        name: 'Layer7LoginForm',
    }
);
