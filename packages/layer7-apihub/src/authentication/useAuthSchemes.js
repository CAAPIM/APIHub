import { useEffect, useState } from 'react';
import { useApiHub } from '../ApiHubContext';
import { getFetchJson } from '../fetchUtils';

export const getAuthSchemes = async (url, originHubName) => {
    const fetchJson = getFetchJson(originHubName);
    const timestamp = Date.now();
    const { json } = await fetchJson(
        `${url}/admin/public/auth/schemes?_=${timestamp}`
    );

    return json.authSchemes.filter(scheme => !scheme.defaultConfig);
};

export const useAuthSchemes = () => {
    const { url, originHubName } = useApiHub();

    const [authSchemes, setAuthSchemes] = useState([]);

    useEffect(() => {
        getAuthSchemes(url, originHubName).then(setAuthSchemes);
    }, [originHubName, url]);

    return authSchemes;
};
