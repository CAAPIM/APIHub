import { stringify } from 'query-string';

const basePath = '/api-management/1.0/apis';
const internalBasePath = '/api-management/internal';
const apisPath = '/2.0/Apis';

const SearchFields = ['name', 'description'];
export const apisDataProvider = context => {
    return {
        async getList({ filter, pagination, sort }) {
            const sortField = sort.field == 'id' ? 'uuid' : sort.field;
            const url = `${context.apiUrl}${basePath}?${stringify({
                ...getFilter(filter),
                page: pagination.page - 1,
                size: pagination.perPage,
                sort: `${sortField},${sort.order}`,
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

        async getMany({ ids }) {
            const apis = await Promise.all(ids.map(id => this.getOne({ id })));

            return {
                data: apis.reduce((acc, getOneResult) => {
                    acc.push(getOneResult.data);
                    return acc;
                }, []),
            };
        },

        async getOne({ id }) {
            const url = `${context.apiUrl}${basePath}/${id}`;

            const {
                json: { uuid, ...data },
            } = await context.fetchJson(url, { credentials: 'include' });

            return {
                data: { ...data, id: uuid },
            };
        },

        async getPermissions({ id }) {
            const url = `${context.apiUrl}${internalBasePath}/permissions/apis/${id}/permitted`;

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

        async getApis() {
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
                        portalStatus: item.PortalStatus,
                        ...item,
                    })) || [],
                total: json.length || 0,
            };
        },

        async getApisByApiGroup({ apiGroupId }) {
            // Filter by API Group
            const { json: apiGroupApisIds } = await context.fetchJson(
                `${context.apiUrl}/api-management/1.0/api-groups/${apiGroupId}/apis`,
                {
                    credentials: 'include',
                }
            );

            const apis = await Promise.all(
                apiGroupApisIds.map(({ uuid }) => {
                    // Get APIs One By One
                    return context
                        .fetchJson(`${context.apiUrl}${basePath}/${uuid}`, {
                            credentials: 'include',
                        })
                        .then(({ data }) => data);
                })
            );

            return {
                data: apis,
                total: apis.length,
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
