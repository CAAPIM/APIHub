// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
const basePath = '/api-management/1.0/apis';

export const assetsDataProvider = context => ({
    getManyReference: async ({ id }) => {
        const url = `${context.apiUrl}${basePath}/${id}/assets`;

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
});
