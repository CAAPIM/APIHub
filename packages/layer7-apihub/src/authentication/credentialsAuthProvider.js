export const credentialsAuthProvider = (apiUrl, adminUrl) => ({
    login: async ({ username, password }) => {
        try {
            const response = await fetch(`${apiUrl}/authenticate/login`, {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    password,
                    eula: 'accept',
                }),
                credentials: 'include',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                }),
            });

            const { respCode, respMsg } = await response.json();

            if (respCode < 200 || respCode >= 300) {
                throw new Error(respMsg);
            }
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    },
    logout: async () => {
        try {
            await fetch(`${adminUrl}/logout`, {
                credentials: 'include',
            });
            return Promise.resolve();
        } catch (error) {
            console.error(error);
        }
    },
    checkAuth: () => {
        return Promise.resolve();
    },
    checkError: () => {
        return Promise.resolve();
    },
    getPermissions: async () => {
        return Promise.resolve();
    },
});
