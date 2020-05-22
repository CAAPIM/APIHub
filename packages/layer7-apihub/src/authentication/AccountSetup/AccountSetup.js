import React from 'react';

import { AuthenticationLayout } from '../AuthenticationLayout';
import { AccountSetupForm } from './AccountSetupForm';
import { useAccountData } from './useAccountData';
import { PreparingForm } from './PreparingForm';
import { InvalidRequest } from './InvalidRequest';
import { SetupSucceeded } from './SetupSucceeded';

/**
 * The page displaying the account setup form
 *
 * @param {*} Header A React Component used as the page header
 * @param {*} Content A React Component used to display some content next to the account setup form
 * @param {*} Footer A React Component used as the page footer
 *
 * @example <caption>Simple usage</caption>
 * <AccountSetupPage />
 *
 * const MyApp = props => <Admin accountSetupPage={MyAccountSetupPage} {...props} />
 *
 * @example <caption>With customized parts</caption>
 * const Header = () => <header><h1>My company</h1></header>
 * const Content = () => <section><p>Welcome to My Product.</p></section>
 * const Footer = () => <footer>Copyright © 2020 My Company. All Rights Reserved</footer>
 *
 * const AccountSetupPagePage = props => (
 *     <AccountSetupPage
 *         Header={CustomHeader}
 *         Content={CustomContent}
 *         Footer={CustomFooter}
 *         {...props}
 *     />
 * );
 *
 * const MyApp = props => <Admin accountSetupPage={MyAccountSetupPage} {...props} />
 */
export const AccountSetupPage = ({
    location,
    Layout = AuthenticationLayout,
    ...props
}) => {
    const [state, accountData, submitAccountData] = useAccountData(location);

    const handleSubmit = data => {
        submitAccountData(data);
    };

    return (
        <Layout {...props}>
            {state === 'prepare' ? (
                <PreparingForm />
            ) : state === 'fill' ? (
                <AccountSetupForm
                    initialValues={accountData}
                    onSubmit={handleSubmit}
                />
            ) : state === 'invalid_request' ? (
                <InvalidRequest />
            ) : state === 'success' ? (
                <SetupSucceeded />
            ) : null}
        </Layout>
    );
};
