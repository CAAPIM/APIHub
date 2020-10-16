import { dataProvider as getDataProvider } from 'layer7-apihub';
import { fetchUtils } from 'ra-core';

export const dataProvider = (baseUrl, tenantName) => {
    const defaultDataProvider = getDataProvider(baseUrl, tenantName);

    const proxy = new Proxy(fakeDataProvider, {
        get: (target, name) => {
            return async (resource, params) => {
                if (
                    resource === 'apis' &&
                    name === 'getList' &&
                    params.filter.apiGroup
                ) {
                    const apiUrl = `${baseUrl}/api/${tenantName}`;
                    const { apiGroup, ...filter } = params.filter;
                    const hasMoreFilters = Object.keys(filter).length > 0;

                    const { json } = await fetchUtils.fetchJson(
                        `${apiUrl}/api-management/1.0/api-groups/${params.filter.apiGroup}/apis`,
                        {
                            credentials: 'include',
                        }
                    );

                    const apis = await Promise.all(
                        json.map(({ uuid }) =>
                            defaultDataProvider
                                .getOne('apis', { id: uuid })
                                .then(({ data }) => data)
                        )
                    );

                    if (
                        apis.length <= params.pagination.perPage &&
                        !hasMoreFilters
                    ) {
                        return { data: apis, total: apis.length };
                    }

                    // Will contains the APIs matching all filters except apiGroup
                    let filteredApis = false;

                    if (hasMoreFilters) {
                        filteredApis = (
                            await defaultDataProvider.getList(resource, {
                                ...params,
                                filter,
                                pagination: {
                                    page: 0,
                                    size: 1000,
                                },
                            })
                        ).data;

                        const apisFromGroup = filteredApis.filter(api =>
                            apis.some(({ uuid }) => api.uuid === uuid)
                        );

                        return {
                            data: apisFromGroup,
                            total: apisFromGroup.length,
                        };
                    }
                }

                return defaultDataProvider[name](resource, params);
            };
        },
    });

    return proxy;
};

// Only used to configure the proxy
const fakeDataProvider = {
    create: () => Promise.resolve(null),
    delete: () => Promise.resolve(null),
    deleteMany: () => Promise.resolve(null),
    getList: () => Promise.resolve(null),
    getMany: () => Promise.resolve(null),
    getManyReference: () => Promise.resolve(null),
    getOne: () => Promise.resolve(null),
    update: () => Promise.resolve(null),
    updateMany: () => Promise.resolve(null),
};
