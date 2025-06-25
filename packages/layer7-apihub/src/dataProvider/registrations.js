// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
const basePath = '/v2/users/registrations';

const prepareCreateData = ({ ...body }) => JSON.stringify(body);

export const registrationsDataProvider = context => {
    return {
        create: async ({ data, ...body }) => {
            const url = `${context.apiUrl}${basePath}`;

            const { json } = await context.fetchJson(url, {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(data),
            });

            return {
                data: { ...json },
            };
        },
    };
};
