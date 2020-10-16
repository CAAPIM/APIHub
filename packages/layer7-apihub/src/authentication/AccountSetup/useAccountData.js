import { useEffect, useState } from 'react';

import { useApiHub } from '../../ApiHubContext';
import { extractTokenFromUrl } from '../extractTokenFromUrl';
import { usePasswordEncryption } from '../usePasswordEncryption';
import { getFetchJson } from '../../fetchUtils';
import { useLayer7Notify } from '../../useLayer7Notify';

export const fetchAccountData = async (urlWithTenant, originHubName, token) => {
    const fetchJson = getFetchJson(originHubName);

    const { json } = await fetchJson(
        `${urlWithTenant}/accountSetup?token=${token}`
    );
    return json;
};

export const submitAccountData = async (
    urlWithTenant,
    originHubName,
    token,
    notify,
    data = {}
) => {
    const { confirm_password, terms, ...account } = data;
    const fetchJson = getFetchJson(originHubName);
    const { json } = await fetchJson(
        `${urlWithTenant}/accountSetup?token=${token}`,
        {
            method: 'put',
            body: JSON.stringify({
                token,
                ...account,
            }),
        }
    )
        .then(({ json }) => !!json)
        .catch(error => {
            notify(
                error || 'apihub.new_password.notifications.invalid_token',
                'error'
            );
            throw error;
        });
};

/**
 * This hook extracts the token from the url, fetch the account data and provides
 * a function to set up the account.
 *
 * It returns a tupple containing
 * - the current status of the form (prepare, fill, invalid_request and success)
 * - the account data to initialize the form
 * - a function to submit the new account data
 */
export const useAccountData = (location = window.location.href) => {
    const [state, setState] = useState('prepare');
    const [accountData, setAccountData] = useState(null);
    const [serverError, setServerError] = useState(null);

    const notify = useLayer7Notify();
    const { urlWithTenant, originHubName } = useApiHub();
    const token = extractTokenFromUrl(location);
    const [publicKey, encrypt] = usePasswordEncryption();

    useEffect(() => {
        if (state === 'prepare') {
            fetchAccountData(urlWithTenant, originHubName, token)
                .then(({ email, ...rest }) => {
                    const isVerified = !!email;
                    if (isVerified) {
                        setState('fill');
                        setAccountData({ email, ...rest });
                        return;
                    }
                    throw Error('Cannot get account setup data');
                })
                .catch(() => {
                    setAccountData(null);
                    setState('invalid_request');
                });
        }
    }, [urlWithTenant, token, state, accountData, originHubName]);

    const handleSubmitAccountData = data => {
        let finalData = data;
        if (publicKey) {
            finalData = {
                ...data,
                password: encrypt(data.password),
            };
        }
        return submitAccountData(
            urlWithTenant,
            originHubName,
            token,
            notify,
            finalData
        )
            .then(() => {
                setState('success');
            })
            .catch(error => {
                setServerError(error);
                setState('error');
            });
    };
    return [state, accountData, handleSubmitAccountData, serverError];
};
