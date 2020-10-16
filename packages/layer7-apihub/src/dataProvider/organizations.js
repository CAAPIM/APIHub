import { stringify } from 'query-string';

export const organizationsDataProvider = context => {
    const basePath = `${context.apiUrl}/api-management/1.0/organizations`; // GET ONE - GET LIST
    const legacyPath = `${context.apiUrl}/Organizations`; // CREATE - UPDATE - DELETE
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
            const url = `${legacyPath}`;

            const body = {
                Name: data.name,
                Description: data.description,
                Status: data.status,
                AccountPlanUuid: data.accountPlanUuid,
            };

            const {
                json: { Uuid },
            } = await context.fetchJson(url, {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(body),
            });

            return {
                data: {
                    id: Uuid,
                    ...data,
                },
            };
        },

        update: async ({ id, data }) => {
            const url = `${legacyPath}('${id}')`;

            const body = {
                Name: data.name,
                Description: data.description,
                Status: data.status,
                AccountPlanUuid: data.accountPlanUuid,
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
            const url = `${legacyPath}('${id}')`;

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
