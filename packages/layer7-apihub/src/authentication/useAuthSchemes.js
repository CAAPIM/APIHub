import { useEffect, useState } from 'react';
import get from 'lodash/get';
import { useApiHub } from '../ApiHubContext';
import { getFetchJson } from '../fetchUtils';

export const getAuthSchemes = async (
    urlWithTenant,
    originHubName,
    location
) => {
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
    if (defaultLoginScheme && defaultLoginScheme.authMethod === 'SAML') {
        isSamlDefaultConfig = true;
    }

    let host = window.location.href;
    if (location && location.state) {
        host =
            host.replace(window.location.hash, '') +
            '#' +
            location.state.nextPathname;
    }

    var encoded_query_param = encodeURIComponent(host);
    schemesList.forEach((authScheme, i) => {
        if (authScheme.authMethod === 'SAML') {
            authScheme.url = authScheme.url + '?fromUrl=' + encoded_query_param;
        } else if (authScheme.authMethod === 'SAML_DEPRECATED') {
            authScheme.url = authScheme.url + '?fromUrl=' + encoded_query_param;
        }
    });

    if (json.isOktaProxied || json.isSamlProxied) {
        schemesList = schemesList.filter(
            scheme => scheme.authMethod !== 'SAML'
        );
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

export const useAuthSchemes = location => {
    const { urlWithTenant, originHubName } = useApiHub();
    const [authSchemes, setAuthSchemes] = useState([]);
    const [enhancedPasswordSecurity, setEnhancedPasswordSecurity] = useState(
        false
    );

    useEffect(() => {
        getAuthSchemes(urlWithTenant, originHubName, location).then(resp => {
            setAuthSchemes(resp[0]);
            setEnhancedPasswordSecurity(resp[1]);
        });
    }, [location, originHubName, urlWithTenant]);

    const defaultScheme = authSchemes.find(scheme => scheme.defaultConfig);

    return [authSchemes, defaultScheme, enhancedPasswordSecurity];
};
