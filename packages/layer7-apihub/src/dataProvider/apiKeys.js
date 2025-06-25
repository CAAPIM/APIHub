// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { stringify } from 'query-string';

export const apiKeysDataProvider = context => {
    const basePath = `${context.apiUrl}/api-management/1.0/applications`;
    return {
        getList: async ({
            filter = {},
            pagination = { page: 1, perPage: 24 },
            sort = null,
            meta = {},
        }) => {
            const { applicationUuid } = meta;
            const path = `${basePath}/${applicationUuid}/api-keys`;
            const url = `${path}?${stringify({
                ...filter,
                page: pagination.page - 1,
                size: pagination.perPage,
                sort: `${sort.field},${sort.order}`,
            })}`;

            const { json } = await context.fetchJson(url, {
                credentials: 'include',
            });

            return {
                data:
                    json.results.map(({ apiKey, ...item }) => ({
                        id: apiKey,
                        apiKey,
                        ...item,
                    })) || [],
                total: json.totalElements || 0,
                totalPages: json.totalPages,
            };
        },
        getOne: async ({ id: apiKey, meta }) => {
            const { appUuid } = meta;
            const url = `${basePath}/${appUuid}/api-keys/${apiKey}`;

            const { json } = await context.fetchJson(url, {
                credentials: 'include',
            });
            return {
                data: {
                    ...json,
                    id: json.apiKey,
                },
            };
        },
        create: async ({ data, meta }) => {
            const { appUuid } = meta;
            const path = `${basePath}/${appUuid}/api-keys`;
            const { json } = await context.fetchJson(path, {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify({ ...data, applicationUuid: appUuid }),
            });
            return {
                data: {
                    ...json,
                    id: json.apiKey,
                },
            };
        },
        delete: async ({ id, meta }) => {
            const { appUuid, params } = meta;
            const path = `${basePath}/${appUuid}/api-keys/${id}?${params}`;

            const {
                json: { ...data },
            } = await context
                .fetchJson(path, {
                    credentials: 'include',
                    method: 'DELETE',
                })
                .catch();

            return {
                data: { data },
            };
        },
    };
};
