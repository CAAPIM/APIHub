// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
export const authProviderClientDefinitionsDataProvider = context => {
    const basePath = `${context.apiUrl}/api-management/0.1/auth-providers`;

    return {
        getList: async ({ authProviderUuid }) => {
            const path = `${basePath}/${authProviderUuid}/client-definitions`;
            const { json = [] } = await context.fetchJson(path, {
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
