// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTranslate, useCheckAuth, useRedirect } from 'react-admin';

import { useClearNotifications } from '../../ui';
import { LoginForm } from './LoginForm';
import { SignUpLink } from './SignUpLink';
import { AuthenticationLayout } from '../AuthenticationLayout';
import { useAuthenticationConfiguration } from '..';
import { WarningIcon } from './Icons';

/**
 * The login component which includes the login form and the signup link.
 * Redirects to the main application page if the user is already logged in.
 */
export const Login = props => {
    const { classes } = useStyles(props);
    const translate = useTranslate();

    const clearNotifications = useClearNotifications();

    useEffect(() => {
        clearNotifications();
    }, [clearNotifications]);

    const {
        signUpEnabled,
        localLoginsDisabled,
    } = useAuthenticationConfiguration();

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
    const [
        isShowingMultiSessionPrompt,
        setIsShowingMultiSessionPrompt,
    ] = useState(false);

    return (
        <>
            {!isShowingMultiSessionPrompt && (
                <Typography
                    variant="h2"
                    color="textPrimary"
                    className={classes.title}
                >
                    {translate('apihub.login.title')}
                </Typography>
            )}
            {isShowingMultiSessionPrompt && (
                <div>
                    <div className={classes.warning_icon}>
                        <WarningIcon />
                    </div>
                    <Typography
                        variant="h3"
                        color="textPrimary"
                        className={classes.multi_sessions_title}
                    >
                        {translate('apihub.login.multiple_sessions_title')}
                    </Typography>
                    <div className={classes.multi_sessions_text}>
                        {translate('apihub.login.multiple_sessions_text')}
                    </div>
                </div>
            )}
            <LoginForm
                isShowingMultiSessionPrompt={isShowingMultiSessionPrompt}
                localLoginsDisabled={localLoginsDisabled}
                setIsShowingMultiSessionPrompt={setIsShowingMultiSessionPrompt}
                {...props}
            />
            {signUpEnabled &&
            !isShowingMultiSessionPrompt &&
            !localLoginsDisabled ? (
                <SignUpLink />
            ) : null}
        </>
    );
};
export const LoginPage = props => (
    <AuthenticationLayout {...props}>
        <Login />
    </AuthenticationLayout>
);

const useStyles = makeStyles({ name: 'Layer7Login' })(
    theme => ({
        title: {
            fontSize: theme.typography.fontSize * 2,
            marginBottom: theme.spacing(6),
        },
        multi_sessions_title: {
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 10,
            marginTop: 2,
            textAlign: 'center',
        },
        multi_sessions_text: {
            fontFamily: theme.typography.body1.fontFamily,
            fontSize: 14,
            marginBottom: 32,
            textAlign: 'center',
            width: 330,
        },
        warning_icon: {
            textAlign: 'center',
        },
    })
);
