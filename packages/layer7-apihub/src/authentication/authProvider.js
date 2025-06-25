// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { credentialsAuthProvider } from './credentialsAuthProvider';
import { getFetchJson } from '../fetchUtils';
import { deleteApiHubPreference } from '../preferences';

const LOGIN_SCHEME = '@layer7/authentication/loginScheme';
const LOGGED_IN = '@layer7/authentication/loggedIn';

const checkError = error => {
    const status = error.status;

    if (!status) {
        // TypeError: Network request failed
        return Promise.reject(error);
    }

    switch (error.status) {
        case 401: // Unauthorized
        case 500: // Internal Server Error
            return Promise.reject(error);
        default:
            return Promise.resolve(error);
    }
};

export const authProvider = (
    baseUrl,
    tenantName,
    originHubName,
    keyLoginScheme = LOGIN_SCHEME,
    keyLoggedIn = LOGGED_IN,
    fetchJson = getFetchJson(originHubName)
) => {
    const apiUrl = `${baseUrl}/api/${tenantName}`;
    const providers = {
        credentials: credentialsAuthProvider(apiUrl, fetchJson),
    };

    const getIsLoggedIn = () => {
        return JSON.parse(sessionStorage.getItem(keyLoggedIn));
    };

    const setIsLoggedIn = value => {
        sessionStorage.setItem(keyLoggedIn, JSON.stringify(value));
    };

    const removeIsLoggedIn = () => {
        sessionStorage.removeItem(keyLoggedIn);
    };

    let schemeUsedForLogin = null;

    const getSchemeUsedForLogin = () => {
        if (!schemeUsedForLogin) {
            schemeUsedForLogin = localStorage.getItem(keyLoginScheme);
        }
        return schemeUsedForLogin;
    };

    const setSchemeUsedForLogin = scheme => {
        localStorage.setItem(keyLoginScheme, scheme);
    };

    const getProviderUsedForLogin = () => {
        const scheme = getSchemeUsedForLogin();
        return providers[scheme];
    };

    return {
        login: async ({ scheme, ...params }) => {
            setSchemeUsedForLogin(scheme);

            const authProviderUsedForLogin = getProviderUsedForLogin();

            if (!authProviderUsedForLogin) {
                throw new Error(`Unknown authentication scheme ${scheme}`);
            }
            await authProviderUsedForLogin.login(params);

            // If we got this far, the authentication should be fine
            // Store this fact in storage
            setIsLoggedIn(true);
        },
        logout: async () => {
            const authProviderUsedForLogin = getProviderUsedForLogin();
            if (authProviderUsedForLogin) {
                await authProviderUsedForLogin.logout();
            } else {
                // Call the default logout route
                try {
                    await fetchJson(`${apiUrl}/logout`);
                    return Promise.resolve();
                } catch (error) {
                    console.error(error);
                }
            }
            // Don't set the isLoggedIn variable to false
            // to force the checkAuth method to check if the user is authenticated by fetching the API
            removeIsLoggedIn();

            // The documentation locale should reset to the preferred UI locale
            // for every new session
            deleteApiHubPreference('documentationLocale');
            return Promise.resolve();
        },
        checkAuth: async () => {
            //Added this logic to handle newpassword/accountsetup/resetpassword url contains %23
            const pathName = window.location.href ? window.location.href : '';
            if (pathName.includes('%23')) {
                const newPath = pathName.replace('%23', '#');
                window.location.href = newPath;
            } else {
                try {
                    // Perform your authentication check here (e.g., token validation)
                    const isAuthenticated = await fetchJson(
                        `${apiUrl}/sessionCheck`
                    );
                    if (isAuthenticated) {
                        return Promise.resolve();
                    } else {
                        return Promise.reject();
                    }
                } catch (error) {
                    return Promise.reject();
                }
            }
        },
        checkError,
        getPermissions: async () => {
            const authProviderUsedForLogin = getProviderUsedForLogin();

            if (authProviderUsedForLogin) {
                return authProviderUsedForLogin.getPermissions();
            }
            return Promise.resolve();
        },
    };
};
