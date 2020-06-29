import React, { useEffect } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useTranslate, useCheckAuth, useRedirect } from 'react-admin';

import { useClearNotifications } from '../../ui';
import { LoginForm } from './LoginForm';
import { SignUpLink } from './SignUpLink';
import { AuthenticationLayout } from '../AuthenticationLayout';
import { useAuthenticationConfiguration } from '..';

/**
 * The login component which includes the login form and the signup link.
 * Redirects to the main application page if the user is already logged in.
 */
export const Login = props => {
    const classes = useStyles(props);
    const translate = useTranslate();

    const clearNotifications = useClearNotifications();

    useEffect(() => {
        clearNotifications();
    }, [clearNotifications]);

    const { signUpEnabled } = useAuthenticationConfiguration();

    const checkAuth = useCheckAuth();
    const redirect = useRedirect();
    useEffect(() => {
        checkAuth({}, false)
            .then(() => {
                // Redirects the main page
                // if the user is already authenticated
                redirect('/');
            })
            .catch(() => {
                // Not authenticated, stay on the login page
            });
    }, [checkAuth, redirect]);

    return (
        <>
            <Typography
                variant="h2"
                color="textPrimary"
                className={classes.title}
            >
                {translate('apihub.login.title')}
            </Typography>
            <LoginForm {...props} />
            {signUpEnabled ? <SignUpLink /> : null}
        </>
    );
};
export const LoginPage = props => (
    <AuthenticationLayout {...props}>
        <Login />
    </AuthenticationLayout>
);

const useStyles = makeStyles(
    theme => ({
        title: {
            fontSize: theme.typography.fontSize * 2,
            marginBottom: theme.spacing(6),
        },
    }),
    {
        name: 'Layer7Login',
    }
);
