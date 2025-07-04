// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
export const apiEulasDataProvider = context => {
    return {
        getOne: async ({ id }) => {
            const url = `${context.apiUrl}/api-management/1.0/eulas/${id}`;

            const {
                json: { ...data },
            } = await context.fetchJson(url, { credentials: 'include' });

            return {
                data: { id, ...data },
            };
        },
    };
};
