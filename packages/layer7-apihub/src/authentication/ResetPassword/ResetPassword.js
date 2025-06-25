// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { Typography } from '@mui/material';
import { useTranslate } from 'react-admin';

import { ResetPasswordForm } from './ResetPasswordForm';
import { ResetPasswordConfirm } from './ResetPasswordConfirm';
import { useResetPassword } from '../useResetPassword';
import { AuthenticationLayout } from '../AuthenticationLayout';
import { useAuthenticationConfiguration } from '..';

/**
 * The component used to reset a password
 */
export const ResetPassword = props => {
    const [username, setUsername] = useResetPassword();
    const { localLoginsDisabled } = useAuthenticationConfiguration();
    const translate = useTranslate();

    const handleSubmit = username => {
        setUsername(username);
    };

    if (username) {
        return (
            <>
                <Typography
                    variant="h4"
                    component="h2"
                    color="textPrimary"
                    gutterBottom
                >
                    {translate('apihub.reset_password.title')}
                </Typography>
                <ResetPasswordConfirm {...props} />
            </>
        );
    }
    return (
        <>
            <Typography
                variant="h4"
                component="h2"
                color="textPrimary"
                gutterBottom
            >
                {translate('apihub.reset_password.title')}
            </Typography>
            <ResetPasswordForm
                handleSubmit={handleSubmit}
                localLoginsDisabled={localLoginsDisabled}
                {...props}
            />
        </>
    );
};

/**
 * The page displaying the reset password form
 *
 * @param {*} Header A React Component used as the page header
 * @param {*} Content A React Component used to display some content next to the reset password form
 * @param {*} Footer A React Component used as the page footer
 *
 * @example <caption>Simple usage</caption>
 * <ResetPasswordPage />
 *
 * const MyApp = props => <Admin resetPasswordPage={MyResetPasswordPage} {...props} />
 *
 * @example <caption>With customized parts</caption>
 * const Header = () => <header><h1>My company</h1></header>
 * const Footer = () => <footer>Copyright © 2020 My Company. All Rights Reserved</footer>
 * const Content = () => <section><p>Welcome to My Product.</p></section>
 *
 * const MyResetPasswordPage = props => (
 *     <ResetPasswordPage
 *         Header={CustomHeader}
 *         Content={CustomContent}
 *         Footer={CustomFooter}
 *         {...props}
 *     />
 * );
 *
 * const MyApp = props => <Admin resetPasswordPage={MyResetPasswordPage} {...props} />
 */
export const ResetPasswordPage = props => {
    return (
        <AuthenticationLayout {...props}>
            <ResetPassword />
        </AuthenticationLayout>
    );
};
