import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { useTranslate, useCheckAuth, useRedirect } from 'react-admin';

import { useClearNotifications } from '../../ui';
import { LoginForm } from './LoginForm';
import { AuthenticationLayout } from '../AuthenticationLayout';

/**
 * The page displaying the login form.
 * Redirects to the main application page if the user is already logged in.
 *
 * @param {*} Header A React Component used as the page header
 * @param {*} Content A React Component used to display some content next to the login form
 * @param {*} Footer A React Component used as the page footer
 *
 * @example <caption>Simple usage</caption>
 * <LoginPage />
 *
 * const MyApp = props => <Admin loginPage={MyLogin} {...props} />
 *
 * @example <caption>With customized parts</caption>
 * const Header = () => <header><h1>My company</h1></header>
 * const Footer = () => <footer>Copyright © 2020 My Company. All Rights Reserved</footer>
 * const Content = () => <section><p>Welcome to My Product.</p></section>
 *
 * const MyLoginPage = props => (
 *     <LoginPage
 *         Header={CustomHeader}
 *         Content={CustomContent}
 *         Footer={CustomFooter}
 *         {...props}
 *     />
 * );
 *
 * const MyApp = props => <Admin loginPage={MyLogin} {...props} />
 */
export const LoginPage = props => {
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
    });

    return <LoginPageWithoutRedirection {...props} />;
};

/**
 * The same page as the <LoginPage /> without the redirection.
 *
 * @param {*} Header A React Component used as the page header
 * @param {*} Content A React Component used to display some content next to the login form
 * @param {*} Footer A React Component used as the page footer
 *
 * @example <caption>Simple usage</caption>
 * <LoginPageWithoutRedirection />
 *
 * const MyApp = props => <Admin loginPage={MyLogin} {...props} />
 *
 * @example <caption>With customized parts</caption>
 * const Header = () => <header><h1>My company</h1></header>
 * const Footer = () => <footer>Copyright © 2020 My Company. All Rights Reserved</footer>
 * const Content = () => <section><p>Welcome to My Product.</p></section>
 *
 * const MyLoginPage = props => (
 *     <LoginPageWithoutRedirection
 *         Header={CustomHeader}
 *         Content={CustomContent}
 *         Footer={CustomFooter}
 *         {...props}
 *     />
 * );
 *
 * const MyApp = props => <Admin loginPage={MyLogin} {...props} />
 */
export const LoginPageWithoutRedirection = props => {
    const { Layout = AuthenticationLayout } = props;
    const classes = useStyles(props);
    const translate = useTranslate();

    const clearNotifications = useClearNotifications();

    useEffect(() => {
        clearNotifications();
    }, [clearNotifications]);

    // Disabled until a new API is available to get those settings
    // const {
    //     signUpEnabled,
    //     simpleCredentialsEnabled,
    // } = useAuthenticationConfiguration();
    const signUpEnabled = false;
    const simpleCredentialsEnabled = true;

    return (
        <Layout {...props}>
            <Typography variant="h2" className={classes.title}>
                {translate('apihub.login.title')}
            </Typography>
            {simpleCredentialsEnabled ? <LoginForm /> : null}
            {signUpEnabled ? <SignUp /> : null}
        </Layout>
    );
};

const useStyles = makeStyles(theme => ({
    title: {
        fontSize: theme.typography.fontSize * 2,
        marginBottom: theme.spacing(6),
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
}));

export const SignUp = props => {
    const classes = useSignUpStyles(props);
    const translate = useTranslate();

    return (
        <>
            <Typography
                variant="h2"
                className={classes.signUpTitle}
                color="textSecondary"
            >
                {translate('apihub.login.actions.sign_up_title')}
            </Typography>
            <Button
                component={Link}
                to="/signup"
                variant="outlined"
                color="primary"
            >
                {translate('apihub.login.actions.sign_up')}
            </Button>
        </>
    );
};

const useSignUpStyles = makeStyles(theme => ({
    signUpTitle: {
        fontSize: theme.typography.fontSize * 2,
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(2),
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
}));
