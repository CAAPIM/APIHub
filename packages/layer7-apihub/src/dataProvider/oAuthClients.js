// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { stringify } from 'query-string';

export const oAuthClientsDataProvider = context => {
    const basePath = `${context.apiUrl}/api-management/0.1/applications`;
    return {
        getList: async ({
            filter = {},
            pagination = { page: 1, perPage: 24 },
            sort = null,
            meta,
        }) => {
            const { applicationUuid } = meta;
            const path = `${basePath}/${applicationUuid}/oauth/clients`;
            const url = `${path}?${stringify({
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
                    json.results.map(({ clientId, ...item }) => ({
                        id: clientId,
                        clientId,
                        ...item,
                    })) || [],
                total: json.totalElements || 0,
                totalPages: json.totalPages,
            };
        },
        getOne: async ({ appUuid, clientId }) => {
            const url = `${basePath}/${appUuid}/oauth/clients/${clientId}`;

            const { json } = await context.fetchJson(url, {
                credentials: 'include',
            });
            return {
                data: {
                    ...json,
                    id: json.clientId,
                },
            };
        },
        create: async ({ data, meta }) => {
            const { appUuid } = meta;
            const path = `${basePath}/${appUuid}/oauth/clients`;
            const { json } = await context
                .fetchJson(path, {
                    credentials: 'include',
                    method: 'POST',
                    body: JSON.stringify({ ...data, applicationUuid: appUuid }),
                })
                .catch();
            return {
                data: {
                    ...json,
                    id: json.clientId,
                },
            };
        },
        delete: async ({ id, meta }) => {
            const { appUuid, params } = meta;
            const path = `${basePath}/${appUuid}/oauth/clients/${id}?${params}`;

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
        completeRegistration: async ({ clientId, appUuid }) => {
            let secretGenerateURL = `${basePath}/${appUuid}/oauth/clients/${clientId}/complete-registration`;
            const responseData = await context.fetchJson(secretGenerateURL, {
                credentials: 'include',
                method: 'PATCH',
            });
            const { json: data } = responseData;
            return {
                data,
            };
        },
    };
};
