import { stringify } from 'query-string';

export const apiKeysDataProvider = context => {
    return {
        getList: async ({
            applicationUuid,
            filter = {},
            pagination = { page: 1, perPage: 24 },
            sort = null,
        }) => {
            const basePath = `${context.apiUrl}/api-management/1.0/applications/${applicationUuid}/api-keys`;
            const url = `${basePath}?${stringify({
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
    };
};
