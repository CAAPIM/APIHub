import { stringify } from 'query-string';

const basePath = '/api-management/1.0/apis';
const adminBasePath = '/api-management/internal';
const apisPath = '/2.0/Apis';

const SearchFields = ['name', 'description'];
export const apisDataProvider = context => {
    return {
        getList: async ({ filter, pagination, sort }) => {
            const url = `${context.apiUrl}${basePath}?${stringify({
                ...getFilter(filter),
                page: pagination.page - 1,
                size: pagination.perPage,
                sort: `${sort.field},${sort.order}`,
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
            const url = `${context.apiUrl}${basePath}/${id}`;

            const {
                json: { uuid, ...data },
            } = await context.fetchJson(url, { credentials: 'include' });

            return {
                data: { ...data, id: uuid },
            };
        },

        getPermissions: async ({ id }) => {
            const url = `${context.adminUrl}${adminBasePath}/permissions/apis/${id}/permitted`;

            const { json: data } = await context.fetchJson(url, {
                credentials: 'include',
            });

            return {
                data: {
                    ...data,
                    id,
                },
            };
        },
        getApis: async () => {
            const url = `${context.apiUrl}${apisPath}`;
            const { json } = await context.fetchJson(url, {
                credentials: 'include',
            });

            // Capitalized keys are not used in the new api format.
            // To avoid future breaking changes,
            // we transform the capitalized key.
            return {
                data:
                    json.map(item => ({
                        id: item.Uuid,
                        name: item.Name,
                        description: item.Description,
                        version: item.Version,
                        ...item,
                    })) || [],
                total: json.length || 0,
            };
        },
    };
};

export const getFilter = ({ q, ...filters }, searchFields = SearchFields) => {
    let result = filters;

    if (!q) {
        return filters;
    }

    // The API does not support the `q` field for fulltext search.
    // Instead, we must add a filter for each searchable field supported by this resource
    if (!searchFields || searchFields.length === 0) {
        return result;
    }

    return searchFields.reduce(
        (acc, field) => {
            acc[field] = q;
            return acc;
        },
        { ...filters }
    );
};
