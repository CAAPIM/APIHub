import { useEffect, useState } from 'react';

import { useApiHub } from '../ApiHubContext';

export const fetchResetPassword = async (url, username) => {
    const response = await fetch(
        `${url}/admin/Portal.svc/ResetMyPassword()?Username='${username}'`
    );

    if (response.status < 200 || response.status >= 300) {
        throw new Error(response.statusText);
    }

    return await response.json();
};

export const useResetPassword = () => {
    const { url } = useApiHub();
    const [username, setUsername] = useState('');
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (!fetched && username !== '') {
            fetchResetPassword(url, username).then(() => {
                setFetched(true);
            });
        }
    }, [url, fetched, username]);

    return [username, setUsername];
};
