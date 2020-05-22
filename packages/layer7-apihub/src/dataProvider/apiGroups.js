import { fetchUtils } from 'ra-core';
import { stringify } from 'query-string';

const basePath = '/api-management/1.0/api-groups';

export const apiGroupsDataProvider = (apiUrl, adminUrl) => {
    return {
        getList: async ({
            filter = {},
            pagination = { page: 1, perPage: 25 },
            sort = null,
        }) => {
            const url = `${apiUrl}${basePath}?${stringify({
                ...filter,
                page: pagination.page - 1,
                size: pagination.perPage,
                ...(sort && { sort: `${sort.field},${sort.order}` }),
            })}`;

            const { json } = await fetchUtils.fetchJson(url, {
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
    };
};
