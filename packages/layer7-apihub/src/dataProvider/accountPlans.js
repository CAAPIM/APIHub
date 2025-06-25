// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { stringify } from 'query-string';

export const accountPlansDataProvider = context => {
    const basePath = `${context.apiUrl}/api-management/1.0/account-plans`;

    return {
        getList: async ({
            filter = {},
            pagination = { page: 1, perPage: 24 },
            sort = null,
        }) => {
            const url = `${context.apiUrl}${basePath}?${stringify({
                ...filter,
                page: pagination.page - 1,
                size: pagination.perPage,
                ...(sort && { sort: `${sort.field},${sort.order}` }),
            })}`;

            const { json } = await context.fetchJson(url, {
                credentials: 'include',
            });

            return {
                data:
                    json.results.map(({ uuid, ...item }) => ({
                        id: uuid,
                        ...item,
                    })) || [],
                total: json.totalElements || 0,
            };
        },

        getOne: async ({ id }) => {
            const url = `${context.apiUrl}${basePath}/${id}`;

            const { json } = await context.fetchJson(url, {
                credentials: 'include',
            });

            return {
                data: {
                    id,
                    ...json,
                },
            };
        },
    };
};
