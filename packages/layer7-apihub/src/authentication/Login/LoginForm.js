import React, { useState } from 'react';
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
    const { toolbarProps, ...rest } = props;

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
            await login(params);
        } catch {
            setError('apihub.login.notifications.invalid_credentials');
        }

        setIsLoading(false);
    };

    if (defaultAuthScheme && !defaultAuthScheme.credsReqd) {
        window.location = defaultAuthScheme.url;
        return;
    }

    return (
        <>
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
            </SimpleForm>

            <Typography variant="body1">
                <Link component={RouterLink} to="/reset-password">
                    {translate('apihub.login.actions.forgot_password')}
                </Link>
            </Typography>
            {authSchemes.length > 0 ? (
                <AuthSchemeList
                    onClick={setAuthScheme}
                    authSchemes={authSchemes}
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
