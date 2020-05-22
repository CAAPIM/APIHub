import { fetchUtils } from 'ra-core';

const basePath = '/tags';
const basePathApi = '/api-management/1.0/apis';

export const tagsDataProvider = baseUrl => {
    return {
        getManyReference: async ({ id }) => {
            const url = `${baseUrl}${basePathApi}/${id}/tags`;

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

        getList: async () => {
            const url = `${baseUrl}${basePath}`;

            const { json } = await fetchUtils.fetchJson(url, {
                credentials: 'include',
            });

            return {
                data:
                    json.map(item => ({
                        id: item.name,
                        ...item,
                    })) || [],
                total: json.length,
            };
        },

        getMany: async () => {
            const url = `${baseUrl}${basePath}`;

            const { json } = await fetchUtils.fetchJson(url, {
                credentials: 'include',
            });

            return {
                data:
                    json.map(item => ({
                        id: item.name,
                        ...item,
                    })) || [],
                total: json.length,
            };
        },
    };
};
