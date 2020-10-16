import { useEffect, useState } from 'react';

import { useApiHub } from '../ApiHubContext';
import { getFetchJson } from '../fetchUtils';

export const fetchResetPassword = async (
    urlWithTenant,
    originHubName,
    username
) => {
    const fetchJson = getFetchJson(originHubName);

    const { json } = await fetchJson(
        `${urlWithTenant}/ResetMyPassword()?Username='${username}'`
    );

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
