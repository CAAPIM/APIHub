// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
export const tagsDataProvider = context => {
    const basePath = `${context.apiUrl}/tags`;
    const basePathApi = `${context.apiUrl}/api-management/1.0/apis`;

    return {
        getManyReference: async ({ id }) => {
            const url = `${basePathApi}/${id}/tags`;

            const { json } = await context.fetchJson(url, {
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
            const { json } = await context.fetchJson(basePath, {
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
            const { json } = await context.fetchJson(basePath, {
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
