// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { stringify } from 'query-string';

export const organizationsDataProvider = context => {
    const basePath = `${context.apiUrl}/api-management/1.0/organizations`; // GET ONE - GET LIST
    const organizationBaseUrl = `${context.apiUrl}/tenant-admin/1.0/organizations`; // CREATE - UPDATE - DELETE
    const orgPath = `${context.apiUrl}/tenant-admin/internal/organizations`; // GET ONE - GET LIST
    return {
        getList: async ({
            filter = {},
            pagination = { page: 1, perPage: 24 },
            sort = null,
        }) => {
            const url = `${orgPath}?${stringify({
                status: 'ENABLED',
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
                        ...item,
                        id: uuid,
                    })) || [],
                total: json.totalElements || 0,
            };
        },

        getOne: async ({ id }) => {
            const url = `${basePath}/${id}`;

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

        create: async ({ data }) => {
            const url = `${organizationBaseUrl}`;

            const body = {
                name: data.name,
                description: data.description,
                status: data.status,
                accountPlanUuid: data.accountPlanUuid,
            };

            const {
                json: { uuid },
            } = await context.fetchJson(url, {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(body),
            });

            return {
                data: {
                    id: uuid,
                    ...data,
                },
            };
        },

        update: async ({ id, data }) => {
            const url = `${organizationBaseUrl}/${id}`;

            const body = {
                name: data.name,
                description: data.description,
                status: data.status,
                accountPlanUuid: data.accountPlanUuid,
            };

            await context.fetchJson(url, {
                credentials: 'include',
                method: 'PUT',
                body: JSON.stringify(body),
            });

            return {
                data,
            };
        },

        delete: async ({ id, previousData }) => {
            const url = `${organizationBaseUrl}/${id}`;

            await context.fetchJson(url, {
                credentials: 'include',
                method: 'DELETE',
            });

            return {
                data: previousData,
            };
        },
    };
};
