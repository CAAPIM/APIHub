import { useEffect, useState } from 'react';
import get from 'lodash/get';
import { useApiHub } from '../ApiHubContext';
import { getFetchJson } from '../fetchUtils';

export const getAuthSchemes = async (urlWithTenant, originHubName) => {
    const fetchJson = getFetchJson(originHubName);
    const timestamp = Date.now();
    const { json } = await fetchJson(
        `${urlWithTenant}/public/auth/schemes?_=${timestamp}`
    );
    let schemesList = json.authSchemes.filter(
        scheme => scheme.authMethod !== 'DEFAULT'
    );

    let isSamlDefaultConfig = false;
    const defaultLoginScheme = json.authSchemes.find(
        scheme => scheme.defaultConfig
    );
    if (defaultLoginScheme && (defaultLoginScheme.authMethod === 'SAML')) {
        isSamlDefaultConfig = true;
    }

    if (json.isOktaProxied) {
        schemesList = schemesList.filter(
            scheme => scheme.authMethod !== 'SAML'
        );
        const host = window.location.href;
        const a = document.createElement('a');
        a.href = urlWithTenant;
        const baseUrl = a.protocol + '//' + a.hostname;
        const okta_saml = {
            uuid: '',
            name: 'SSO Login',
            description: '',
            showFyp: false,
            credsReqd: false,
            defaultConfig: isSamlDefaultConfig,
            url: '',
            tenantId: '',
            authMethod: 'SAML',
            links: [],
        };
        var encoded_query_param = encodeURIComponent(host);
        okta_saml.url = `${baseUrl}/admin/login?fromApiHub=true&fromUrl=${encoded_query_param}`;
        schemesList.push(okta_saml);
    }
    const defaultScheme = json.authSchemes.find(
        scheme => scheme.authMethod === 'DEFAULT'
    );
    const enhancedPasswordSecurity = get(
        defaultScheme,
        'advancedConfigurations.enhancedPasswordSecurity'
    );

    return [schemesList, enhancedPasswordSecurity === 'yes'];
};

export const useAuthSchemes = () => {
    const { urlWithTenant, originHubName } = useApiHub();
    const [authSchemes, setAuthSchemes] = useState([]);
    const [enhancedPasswordSecurity, setEnhancedPasswordSecurity] = useState(
        false
    );

    useEffect(() => {
        getAuthSchemes(urlWithTenant, originHubName).then(resp => {
            setAuthSchemes(resp[0]);
            setEnhancedPasswordSecurity(resp[1]);
        });
    }, [originHubName, urlWithTenant]);

    const defaultScheme = authSchemes.find(scheme => scheme.defaultConfig);

    return [authSchemes, defaultScheme, enhancedPasswordSecurity];
};
