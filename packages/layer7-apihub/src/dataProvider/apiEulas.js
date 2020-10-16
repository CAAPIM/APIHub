const basePath = '/ApiEulas';

export const apiEulasDataProvider = context => {
    return {
        getOne: async ({ id }) => {
            const url = `${context.apiUrl}${basePath}('${id}')`;

            const {
                json: { ...data },
            } = await context.fetchJson(url, { credentials: 'include' });

            return {
                data: { id, ...data },
            };
        },
    };
};
