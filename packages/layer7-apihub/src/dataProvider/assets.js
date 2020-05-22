import { fetchUtils } from 'ra-core';

const basePath = '/api-management/1.0/apis';

export const assetsDataProvider = baseUrl => ({
    getManyReference: async ({ id }) => {
        const url = `${baseUrl}${basePath}/${id}/assets`;

        const { json } = await fetchUtils.fetchJson(url, {
            credentials: 'include',
        });

        return {
            data:
                json.map(({ uuid, ...item }) => ({
                    id: uuid,
                    ...item,
                })) || [],
            total: json.totalElements || 0,
        };
    },
});
