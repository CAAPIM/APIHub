import React, { useEffect, useState } from 'react';
import { useTranslate } from 'ra-core';
import { useLocation } from 'react-router';
import Typography from '@material-ui/core/Typography';

import { useApiHub } from '../../ApiHubContext';
import { extractTokenFromUrl } from '../extractTokenFromUrl';
import { NewPasswordForm } from './NewPasswordForm';
import { NewPasswordVerifyingToken } from './NewPasswordVerifyingToken';
import { NewPasswordInvalidToken } from './NewPasswordInvalidToken';
import { NewPasswordSuccess } from './NewPasswordSuccess';
import { AuthenticationLayout } from '../AuthenticationLayout';
import { usePasswordEncryption } from '../usePasswordEncryption';
import { getFetchJson } from '../../fetchUtils';
import { useLayer7Notify } from '../../useLayer7Notify';

/**
 * The component used to create a new password
 * *
 */
export const NewPassword = props => {
    const [state, handleSubmit] = useSetNewPassword();
    const translate = useTranslate();

    switch (state) {
        case 'verifying_token':
            return <NewPasswordVerifyingToken {...props} />;
        case 'request_new_password':
            return (
                <>
                    <Typography
                        variant="h4"
                        component="h2"
                        color="textPrimary"
                        gutterBottom
                    >
                        {translate('apihub.new_password.title')}
                    </Typography>

                    <NewPasswordForm onSubmit={handleSubmit} {...props} />
                </>
            );
        case 'invalid_token':
            return <NewPasswordInvalidToken {...props} />;
        case 'success':
            return <NewPasswordSuccess {...props} />;
        default:
            return null;
    }
};
/**
 * The page displaying the form used to create a new password
 *
 * @param {*} Header A React Component used as the page header
 * @param {*} Content A React Component used to display some content next to the new password form
 * @param {*} Footer A React Component used as the page footer
 *
 * @example <caption>Simple usage</caption>
 * <NewPasswordPage />
 *
 * const MyApp = props => <Admin newPasswordPage={MyNewPassword} {...props} />
 *
 * @example <caption>With customized parts</caption>
 * const Header = () => <header><h1>My company</h1></header>
 * const Footer = () => <footer>Copyright © 2020 My Company. All Rights Reserved</footer>
 * const Content = () => <section><p>Welcome to My Product.</p></section>
 *
 * const MyNewPasswordPage = props => (
 *     <NewPasswordPage
 *         Header={CustomHeader}
 *         Content={CustomContent}
 *         Footer={CustomFooter}
 *         {...props}
 *     />
 * );
 *
 * const MyApp = props => <Admin newPasswordPage={MyNewPassword} {...props} />
 */
export const NewPasswordPage = props => (
    <AuthenticationLayout {...props}>
        <NewPassword />
    </AuthenticationLayout>
);

/**
 * This hook extracts the new password token from the url, verifies it and provides
 * a function to set the new password.
 *
 * It returns a tupple containing the current status (verifying_token, invalid_token, request_new_password and success)
 * and a function to actually submit the new password.
 */
export const useSetNewPassword = () => {
    const [state, setState] = useState('verifying_token');
    const location = useLocation();

    const { urlWithTenant, originHubName } = useApiHub();
    const token = extractTokenFromUrl(location.pathname);
    const [publicKey, encrypt] = usePasswordEncryption();
    const notify = useLayer7Notify();

    useEffect(() => {
        if (state === 'verifying_token') {
            verifyNewPasswordTokenValid(
                urlWithTenant,
                originHubName,
                notify,
                token
            ).then(isVerified => {
                setState(isVerified ? 'request_new_password' : 'invalid_token');
            });
        }
    }, [urlWithTenant, token, state, originHubName, notify]);

    const handleSubmit = async ({ password }) => {
        let finalPassword = password;
        if (publicKey) {
            finalPassword = await encrypt(password);
        }
        return submitNewPassword(urlWithTenant, originHubName, notify, {
            newPassword: finalPassword,
            token,
        }).then(isSuccessful =>
            setState(isSuccessful ? 'success' : 'request_new_password')
        );
    };

    return [state, handleSubmit];
};

const submitNewPassword = (
    urlWithTenant,
    originHubName,
    notify,
    { newPassword, token }
) => {
    const fetchJson = getFetchJson(originHubName);
    return fetchJson(`${urlWithTenant}/v2/users/password/reset/${token}`, {
        method: 'put',
        body: JSON.stringify({ newPassword, uuid: token }),
    })
        .then(() => true)
        .catch(error => {
            notify(error, 'error');
        });
};

const verifyNewPasswordTokenValid = (
    urlWithTenant,
    originHubName,
    notify,
    token
) => {
    const fetchJson = getFetchJson(originHubName);

    return fetchJson(
        `${urlWithTenant}/passwordResetTokenValidate?token=${token}`
    )
        .then(({ json }) => !!json)
        .catch(error => {
            notify(
                error || 'apihub.new_password.notifications.invalid_token',
                'error'
            );
        });
};
