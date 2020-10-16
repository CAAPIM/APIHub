const basePath = '/2.0/Apis';

export const specsDataProvider = context => {
    return {
        getOne: async ({ id }) => {
            const url = `${context.apiUrl}${basePath}('${id}')/SpecContent`;

            const {
                json: { ...data },
            } = await context.fetchJson(url, { credentials: 'include' });

            return {
                data: { id, ...data },
            };
        },
    };
};
