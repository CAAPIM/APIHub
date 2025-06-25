// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { useCreate, useTranslate } from 'react-admin';
import { SignUpForm } from './SignUpForm';
import { AuthenticationLayout } from '../AuthenticationLayout';
import { useLayer7Notify } from '../../useLayer7Notify';

export const SignUp = props => {
    const translate = useTranslate();
    const { classes } = useStyles(props);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [signup] = useSignup();

    const handleSubmit = data => {
        signup(data, {
            onSuccess: () => setShowConfirmation(true),
            onError: error => {
                setServerError({ error });
            },
        });
    };

    return (
        <>
            <Typography
                variant="h2"
                color="textPrimary"
                className={classes.title}
            >
                {translate('resources.registrations.title')}
            </Typography>
            {showConfirmation ? (
                <SignUpConfirmation {...props} />
            ) : (
                <SignUpForm
                    onSubmit={handleSubmit}
                    serverError={serverError}
                    {...props}
                />
            )}
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
export const SignUpPage = props => (
    <AuthenticationLayout {...props}>
        <SignUp />
    </AuthenticationLayout>
);

export const useSignup = () => {
    const [create, state] = useCreate();
    const notify = useLayer7Notify();

    const signup = (data, { onSuccess, onError }) => {
        create(
            'registrations',
            {
                data: {
                    organizationName: '',
                    organizationDescription: '',
                    ...data,
                },
            },
            {
                onSuccess: () => {
                    if (onSuccess) {
                        onSuccess();
                    }
                },
                onError: error => {
                    notify(
                        error || 'resources.registrations.notifications.error',
                        'error'
                    );
                    if (onError) {
                        onError(error);
                    }
                },
            }
        );
    };

    return [signup, state];
};

export const SignUpConfirmation = () => {
    const translate = useTranslate();
    return (
        <>
            <Typography component="p" variant="h6" gutterBottom>
                {translate(
                    'resources.registrations.notifications.confirmation_title'
                )}
            </Typography>
            <Typography variant="body1" gutterBottom>
                {translate(
                    'resources.registrations.notifications.confirmation'
                )}
            </Typography>
            <Typography variant="body1">
                <Link component={RouterLink} to="/login">
                    {translate(
                        'resources.registrations.actions.return_to_homepage'
                    )}
                </Link>
            </Typography>
        </>
    );
};

const useStyles = makeStyles()(theme => ({
    title: {
        fontSize: theme.typography.fontSize * 2,
        marginBottom: theme.spacing(6),
    },
}));
