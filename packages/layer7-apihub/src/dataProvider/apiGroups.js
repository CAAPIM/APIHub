import { stringify } from 'query-string';

const apiGroupsBasePath = '/api-management/internal/OrganizationApiGroups';
const eulaBasePath = '/api-management/internal/ApiGroups/';

const SearchFields = ['name', 'description'];
export const apiGroupsDataProvider = context => {
    return {
        getList: async ({
            filter = {},
            pagination = { page: 1, perPage: 24 },
        }) => {
            const url = `${context.apiUrl}${apiGroupsBasePath}?${stringify({
                ...getFilter(filter),
                page: pagination.page - 1,
                size: pagination.perPage,
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

        getMany: async () => {
            return {
                data: [],
            };
        },

        getApiGroupEula: async ({ apiGroupId, filter = {} }) => {
            const url = `${
                context.apiUrl
            }${eulaBasePath}${apiGroupId}/Eulas?${stringify({
                filter: stringify({ ...filter }),
            })}`;

            const { json } = await context.fetchJson(url, {
                credentials: 'include',
            });

            return {
                data: json.d.results[0],
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
