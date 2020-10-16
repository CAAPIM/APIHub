import { useEffect, useState } from 'react';
import { useApiHub } from '../ApiHubContext';
import { getFetchJson } from '../fetchUtils';

export const getAuthSchemes = async (urlWithTenant, originHubName) => {
    const fetchJson = getFetchJson(originHubName);
    const timestamp = Date.now();
    const { json } = await fetchJson(
        `${urlWithTenant}/public/auth/schemes?_=${timestamp}`
    );
    const authSchemes = json.authSchemes.filter(
        scheme =>
            scheme.authMethod !== 'DEFAULT' &&
            ((json.isOktaProxied === true && scheme.authMethod !== 'SAML') ||
                json.isOktaProxied === false)
    );

    return authSchemes;
};

export const useAuthSchemes = () => {
    const { urlWithTenant, originHubName } = useApiHub();

    const [authSchemes, setAuthSchemes] = useState([]);

    useEffect(() => {
        getAuthSchemes(urlWithTenant, originHubName).then(setAuthSchemes);
    }, [originHubName, urlWithTenant]);

    const defaultScheme = authSchemes.find(scheme => scheme.defaultConfig);

    return [authSchemes, defaultScheme];
};
