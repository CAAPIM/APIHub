// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
export const authProvidersDataProvider = context => {
    const basePath = `${context.apiUrl}/api-management/0.1/auth-providers`;

    return {
        getList: async () => {
            const { json = [] } = await context.fetchJson(basePath, {
                credentials: 'include',
            });

            return {
                data:
                    json.map(({ uuid, ...item }) => ({
                        ...item,
                        id: uuid,
                    })) || [],
                total: json.length,
            };
        },
    };
};
