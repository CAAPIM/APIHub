import { useEffect, useState } from 'react';
import { useApiHub } from '../ApiHubContext';
import { getFetchJson } from '../fetchUtils';

const DEFAULT_SIGNUP_ENABLED = false;
const DEFAULT_SIMPLE_CREDENTIALS_ENABLED = true;
const DEFAULT_SSO_ENABLED = false;
const DEFAULT_TERMS_OF_USE = '';
const DEFAULT_LOCAL_LOGINS_DISABLED = false;

export const fetchAuthenticationConfiguration = async (
    urlWithTenant,
    originHubName
) => {
    const fetchJson = getFetchJson(originHubName);
    const { json } = await fetchJson(`${urlWithTenant}/cmsSettings`);

    

    return {
        signUpEnabled: json.REGISTRATION_STATUS === 'ENABLED',
        simpleCredentialsEnabled:
            json.REGISTRATION_REQUEST_WORKFLOW === 'ENABLED',
        ssoEnabled: json.SSO_ENABLED === 'true',
        termsOfUse: json.REGISTRATION_TERMS_OF_USE || DEFAULT_TERMS_OF_USE,
        localLoginsDisabled: json.DISABLE_LOCAL_LOGINS === 'true',
    };
};

export const useAuthenticationConfiguration = (
    signUpEnabled = DEFAULT_SIGNUP_ENABLED,
    simpleCredentialsEnabled = DEFAULT_SIMPLE_CREDENTIALS_ENABLED,
    ssoEnabled = DEFAULT_SSO_ENABLED,
    termsOfUse = null,
    localLoginsDisabled = DEFAULT_LOCAL_LOGINS_DISABLED,
) => {
    const { urlWithTenant, originHubName } = useApiHub();

    const [configuration, setConfiguration] = useState({
        signUpEnabled,
        simpleCredentialsEnabled,
        ssoEnabled,
        termsOfUse,
        localLoginsDisabled,
    });

    useEffect(() => {
        fetchAuthenticationConfiguration(urlWithTenant, originHubName).then(
            setConfiguration
        );
    }, [originHubName, urlWithTenant]);

    return configuration;
};
