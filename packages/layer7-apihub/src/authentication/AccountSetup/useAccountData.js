import { useEffect, useState } from 'react';

import { useApiHub } from '../../ApiHubContext';
import { extractTokenFromUrl } from '../extractTokenFromUrl';
import { usePasswordEncryption } from '../usePasswordEncryption';
import { getFetchJson } from '../../fetchUtils';

export const fetchAccountData = async (url, originHubName, token) => {
    const fetchJson = getFetchJson(originHubName);

    const { json } = await fetchJson(
        `${url}/admin/accountSetup?token=${token}`
    );
    return json;
};

export const submitAccountData = async (
    url,
    originHubName,
    token,
    data = {}
) => {
    const { confirm_password, terms, ...account } = data;
    const fetchJson = getFetchJson(originHubName);
    const { json } = await fetchJson(
        `${url}/admin/accountSetup?token=${token}`,
        {
            method: 'put',
            body: JSON.stringify({
                token,
                ...account,
            }),
        }
    );

    return json;
};

export const checkUsernameUnicity = async (url, originHubName, username) => {
    const fetchJson = getFetchJson(originHubName);
    const { json } = await fetchJson(
        `${url}/admin/Portal.svc/UserNameUnique()?Name='${username}'`
    );

    return json;
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

    const { url, originHubName } = useApiHub();
    const token = extractTokenFromUrl(location);
    const [publicKey, encrypt] = usePasswordEncryption();

    useEffect(() => {
        if (state === 'prepare') {
            fetchAccountData(url, originHubName, token)
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
    }, [url, token, state, accountData, originHubName]);

    const handleSubmitAccountData = data => {
        let finalData = data;
        if (publicKey) {
            finalData = {
                ...data,
                password: encrypt(data.password),
            };
        }
        return submitAccountData(url, originHubName, token, finalData).then(
            () => {
                setState('success');
            }
        );
    };

    return [state, accountData, handleSubmitAccountData];
};
