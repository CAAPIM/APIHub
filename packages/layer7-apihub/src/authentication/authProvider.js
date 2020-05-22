import { credentialsAuthProvider } from './credentialsAuthProvider';

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
    keyLoginScheme = LOGIN_SCHEME,
    keyLoggedIn = LOGGED_IN
) => {
    const adminUrl = `${baseUrl}/admin`;
    const apiUrl = `${baseUrl}/api/${tenantName}`;
    const providers = {
        credentials: credentialsAuthProvider(apiUrl, adminUrl),
    };

    const getIsLoggedIn = () => {
        return JSON.parse(sessionStorage.getItem(keyLoggedIn));
    };

    const setIsLoggedIn = value => {
        sessionStorage.setItem(keyLoggedIn, JSON.stringify(value));
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
            }
            setIsLoggedIn(false);
            return Promise.resolve();
        },
        checkAuth: async () => {
            // We use the local storage
            // to store if a user using this portal is logged in or not.
            const isLoggedIn = getIsLoggedIn();
            if (isLoggedIn === true) {
                return Promise.resolve();
            }

            if (isLoggedIn === false) {
                return Promise.reject();
            }

            try {
                // But he may use another portal to log in.
                // So fetching the api it's the only way to know
                // if he is already authenticated or not.
                const response = await fetch(`${apiUrl}/userContexts`, {
                    credentials: 'include',
                });
                await checkError(response);
                setIsLoggedIn(true);
            } catch (error) {
                setIsLoggedIn(false);
                return Promise.reject();
            }

            return Promise.resolve();
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
