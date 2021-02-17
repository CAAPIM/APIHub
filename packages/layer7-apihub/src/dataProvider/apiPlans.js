import { stringify } from 'query-string';

const basePath = '/api-management/1.0/api-plans';
const internalBasePath = '/api-management/internal/api-plans';

const SearchFields = ['name', 'description'];
export const apiPlansDataProvider = context => {
    return {
        async getList({ filter, pagination, sort }) {
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

        async getMany({ ids }) {
            const apiPlans = await Promise.all(
                ids.map(id => this.getOne({ id }))
            );

            return {
                data: apiPlans.reduce((acc, getOneResult) => {
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

        async getApisByApiPlan({ apiPlanId }) {
            // Filter by API Plan
            const { json: apiPlanApisIds } = await context.fetchJson(
                `${context.apiUrl}${basePath}/${apiPlanId}/apis`,
                {
                    credentials: 'include',
                }
            );

            const apis = await Promise.all(
                apiPlanApisIds.map(({ uuid }) => {
                    // Get APIs One By One
                    return context
                        .fetchJson(
                            `${context.apiUrl}/api-management/1.0/apis/${uuid}`,
                            {
                                credentials: 'include',
                            }
                        )
                        .then(({ data }) => data);
                })
            );

            return {
                data: apis,
                total: apis.length,
            };
        },

        async getApiPlansByApi({ orgUuid, apiId }) {
            const params = { apiUuid: apiId };
            if (orgUuid) {
                params.orgUuid = orgUuid;
            }
            const url = `${context.apiUrl}${internalBasePath}?${stringify(
                params
            )}`;

            const { json } = await context.fetchJson(url, {
                credentials: 'include'
            });

            return {
                data: json,
                total: json.length,
            };
        },

        async getApiPlansFeatureFlag() {
            const url = `${context.apiUrl}/Settings('FEATURE_FLAG_API_PLANS')`;
            const {
                json: { ...data },
            } = await context.fetchJson(url, {
                credentials: 'include',
            });
            return { data: { value: data.Value } };
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
