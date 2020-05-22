import React from 'react';
import { ResetPasswordForm } from './ResetPasswordForm';
import { ResetPasswordConfirm } from './ResetPasswordConfirm';
import { useResetPassword } from '../useResetPassword';
import { AuthenticationLayout } from '../AuthenticationLayout';

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
    const { Layout = AuthenticationLayout } = props;
    const [username, setUsername] = useResetPassword();

    const onSubmit = ({ username }) => {
        setUsername(username);
    };

    return (
        <Layout {...props}>
            {username ? (
                <ResetPasswordConfirm />
            ) : (
                <ResetPasswordForm onSubmit={onSubmit} />
            )}
        </Layout>
    );
};
