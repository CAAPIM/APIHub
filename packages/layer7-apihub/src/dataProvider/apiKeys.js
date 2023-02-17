import { stringify } from 'query-string';

export const apiKeysDataProvider = context => {
    const basePath = `${context.apiUrl}/api-management/1.0/applications`;
    return {
        getList: async ({
            applicationUuid,
            filter = {},
            pagination = { page: 1, perPage: 24 },
            sort = null,
        }) => {
            const path = `${basePath}/${applicationUuid}/api-keys`;
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
                    json.results.map(({ apiKey, ...item }) => ({
                        id: apiKey,
                        apiKey,
                        ...item,
                    })) || [],
                total: json.totalElements || 0,
            };
        },
        create: async({appUuid, data}) => {
            const path = `${basePath}/${appUuid}/api-keys`;
            const { json } = await context.fetchJson(path, {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify({...data, applicationUuid: appUuid}),
            });
            console.log('json', json);
            return {
                data: {
                    ...json,
                    id: json.apiKey,
                },
            };
        },
        delete: async ({ appUuid, keyId, params }) => {
            const path = `${basePath}/${appUuid}/api-keys/${keyId}?${params}`;

            const {
                json: { ...data },
            } = await context.fetchJson(path, {
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
