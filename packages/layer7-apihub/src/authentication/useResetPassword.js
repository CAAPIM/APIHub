import { useEffect, useState } from 'react';

import { useApiHub } from '../ApiHubContext';
import { getFetchJson } from '../fetchUtils';

export const fetchResetPassword = async (url, originHubName, username) => {
    const fetchJson = getFetchJson(originHubName);

    const { json } = await fetchJson(
        `${url}/admin/Portal.svc/ResetMyPassword()?Username='${username}'`
    );

    return await json;
};

export const useResetPassword = () => {
    const { url, originHubName } = useApiHub();
    const [username, setUsername] = useState('');
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (!fetched && username !== '') {
            fetchResetPassword(url, originHubName, username).then(() => {
                setFetched(true);
            });
        }
    }, [url, fetched, username, originHubName]);

    return [username, setUsername];
};
