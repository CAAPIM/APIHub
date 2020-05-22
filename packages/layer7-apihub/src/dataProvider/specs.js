import { fetchUtils } from 'ra-core';

const basePath = '/2.0/Apis';

export const specsDataProvider = baseUrl => {
    return {
        getOne: async ({ id }) => {
            const url = `${baseUrl}${basePath}('${id}')/SpecContent`;

            const {
                json: { ...data },
            } = await fetchUtils.fetchJson(url, { credentials: 'include' });

            return {
                data: { id, ...data },
            };
        },
    };
};
