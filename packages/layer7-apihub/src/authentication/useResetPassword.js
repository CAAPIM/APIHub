// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { useEffect, useState } from 'react';

import { useApiHub } from '../ApiHubContext';
import { getFetchJson } from '../fetchUtils';

export const fetchResetPassword = async (
    urlWithTenant,
    originHubName,
    username
) => {
    const fetchJson = getFetchJson(originHubName);
    const headers = new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        Accept: 'text/plain, */*; q=0.01',
    });

    const { json } = await fetchJson(`${urlWithTenant}/reset-my-password`, {
        method: 'put',
        headers: headers,
        body: JSON.stringify({ userName: username }),
    });

    return await json;
};

export const useResetPassword = () => {
    const { urlWithTenant, originHubName } = useApiHub();
    const [username, setUsername] = useState('');
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (!fetched && username !== '') {
            fetchResetPassword(urlWithTenant, originHubName, username).then(
                () => {
                    setFetched(true);
                }
            );
        }
    }, [urlWithTenant, fetched, username, originHubName]);

    return [username, setUsername];
};
