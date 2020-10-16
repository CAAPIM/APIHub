export const credentialsAuthProvider = (apiUrl, fetchJson) => ({
    login: async ({ username, password, ...params }) => {
        try {
            const { json } = await fetchJson(`${apiUrl}/authenticate/login`, {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    password,
                    eula: 'accept',
                    ...params,
                }),
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                }),
            });

            const { respCode, respMsg } = json;

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
            await fetchJson(`${apiUrl}/logout`);
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
