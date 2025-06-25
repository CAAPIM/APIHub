// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
export const specsDataProvider = context => {
    return {
        getOne: async ({ id }) => {
            const url = `${context.apiUrl}/api-management/1.0/apis/${id}/assets/swagger`;
            const {
                json: { ...data },
            } = await context.fetchJson(url, { credentials: 'include' });
            const content =
                data && data.content ? JSON.parse(data.content) : {};
            return {
                data: { id, ...content },
            };
        },
    };
};
