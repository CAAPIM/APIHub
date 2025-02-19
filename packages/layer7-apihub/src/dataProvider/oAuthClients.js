import { stringify } from 'query-string';

export const oAuthClientsDataProvider = context => {
    const basePath = `${context.apiUrl}/api-management/0.1/applications`;
    return {
        getList: async ({
            applicationUuid,
            filter = {},
            pagination = { page: 1, perPage: 24 },
            sort = null,
        }) => {
            const path = `${basePath}/${applicationUuid}/oauth/clients`;
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
                    json.results.map(({ clientId, ...item }) => ({
                        id: clientId,
                        clientId,
                        ...item,
                    })) || [],
                total: json.totalElements || 0,
                totalPages: json.totalPages,
            };
        },
        getOne: async ({ appUuid, clientId }) => {
            const url = `${basePath}/${appUuid}/oauth/clients/${clientId}`;

            const { json } = await context.fetchJson(url, {
                credentials: 'include',
            });
            return {
                data: {
                    ...json,
                    id: json.clientId,
                },
            };
        },
        create: async ({ appUuid, data }) => {
            const path = `${basePath}/${appUuid}/oauth/clients`;
            const { json } = await context.fetchJson(path, {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify({ ...data, applicationUuid: appUuid }),
            }).catch();
            console.log('json', json);
            return {
                data: {
                    ...json,
                    id: json.clientId,
                },
            };
        },
        delete: async ({ appUuid, keyId, params }) => {
            const path = `${basePath}/${appUuid}/oauth/clients/${keyId}?${params}`;

            const {
                json: { ...data },
            } = await context
                .fetchJson(path, {
                    credentials: 'include',
                    method: 'DELETE',
                })
                .catch();

            return {
                data: { data },
            };
        },
        completeRegistration: async ({ clientId, appUuid }) => {
          let secretGenerateURL = `${basePath}/${appUuid}/oauth/clients/${clientId}/complete-registration`;
          const responseData = await context.fetchJson(secretGenerateURL, {
              credentials: 'include',
              method: 'PATCH',
          });
          const { json: data } = responseData;
          return {
              data,
          };
      },
    };
};
