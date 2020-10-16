import React from 'react';
import { useTranslate } from 'ra-core';
import Typography from '@material-ui/core/Typography';

import { AuthenticationLayout } from '../AuthenticationLayout';
import { AccountSetupForm } from './AccountSetupForm';
import { AccountSetupPreparingForm } from './AccountSetupPreparingForm';
import { AccountSetupInvalidRequest } from './AccountSetupInvalidRequest';
import { AccountSetupSuccess } from './AccountSetupSuccess';
import { useAccountData } from './useAccountData';

/**
 * The account setup form
 *
 */
export const AccountSetup = props => {
    const [state, accountData, submitAccountData, error] = useAccountData();
    const translate = useTranslate();

    const handleSubmit = data => {
        submitAccountData(data);
    };

    switch (state) {
        case 'prepare':
            return <AccountSetupPreparingForm {...props} />;
        case 'fill':
            return (
                <>
                    <Typography
                        variant="h4"
                        component="h2"
                        color="textPrimary"
                        gutterBottom
                    >
                        {translate('apihub.account_setup.title')}
                    </Typography>
                    <AccountSetupForm
                        initialValues={accountData}
                        onSubmit={handleSubmit}
                        {...props}
                    />
                </>
            );
        case 'invalid_request':
            return <AccountSetupInvalidRequest {...props} />;
        case 'error':
            return (
                <>
                    <Typography
                        variant="h4"
                        component="h2"
                        color="textPrimary"
                        gutterBottom
                    >
                        {translate('apihub.account_setup.title')}
                    </Typography>
                    <AccountSetupForm
                        initialValues={accountData}
                        onSubmit={handleSubmit}
                        error={error}
                        {...props}
                    />
                </>
            );
        case 'success':
            return <AccountSetupSuccess {...props} />;
        default:
            return null;
    }
};

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
 * const MyAccountSetupPage = props => (
 *     <AccountSetupPage
 *         Header={Header}
 *         Content={Content}
 *         Footer={Footer}
 *         {...props}
 *     />
 * );
 *
 * const MyApp = props => <Admin accountSetupPage={MyAccountSetupPage} {...props} />
 *
 */
export const AccountSetupPage = props => {
    return (
        <AuthenticationLayout {...props}>
            <AccountSetup />
        </AuthenticationLayout>
    );
};
