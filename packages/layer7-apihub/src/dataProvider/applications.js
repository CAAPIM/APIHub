import { stringify } from 'query-string';

export const applicationsDataProvider = context => {
    const basePath = `${context.apiUrl}/api-management/1.0/applications`;
    const legacyPath = `${context.apiUrl}/Applications`;

    return {
        getManyReference: async ({
            pagination = { page: 1, perPage: 24 },
            filter: { id },
        }) => {
            const url = `${basePath}?${stringify({
                apiUuid: id,
                page: pagination.page - 1,
                size: pagination.perPage,
            })}`;

            const { json } = await context.fetchJson(url, {
                credentials: 'include',
            });

            return {
                data:
                    json.results.map(({ uuid, ...item }) => ({
                        id: uuid,
                        ...item,
                    })) || [],
                total: json.totalElements || 0,
            };
        },

        getList: async ({
            filter = {},
            pagination = { page: 1, perPage: 24 },
            sort = null,
        }) => {
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
                    json.results.map(({ uuid, ...item }) => ({
                        id: uuid,
                        ...item,
                    })) || [],
                total: json.totalElements || 0,
            };
        },

        getOne: async ({ id }) => {
            const url = `${legacyPath}('${id}')`;

            const {
                json: { Uuid, ...data },
            } = await context.fetchJson(url, { credentials: 'include' });

            // Capitalized keys are not used in the new api format.
            // To avoid future breaking changes,
            // we transform the capitalized key.
            return {
                data: {
                    id: Uuid,
                    name: data.Name,
                    description: data.Description,
                    status: data.Status,
                    organizationUuid: data.OrganizationUuid,
                    organizationName: data.OrganizationName,
                    apiIds: data.ApiIds,
                    apiKey: data.ApiKey,
                    keySecret: data.KeySecret,
                    disabledByType: data.DisabledByType,
                    ...data,
                },
            };
        },

        getSecretHashMetadata: async () => {
            // const url = `${portal.hostname}/api/${portal.tenantPrefix}/Settings('APP_SECRET_HASHING_METADATA')`;
            const url = `${context.apiUrl}/Settings('APP_SECRET_HASHING_METADATA')`;
            const {
                json: { Uuid, ...data },
            } = await context.fetchJson(url, {
                credentials: 'include',
            });
            return {
                data: {
                    id: Uuid,
                    name: data.Name,
                    value: data.Value,
                },
            };
        },

        getGenerateNewSharedSecret: async ({
            isPlainTextSelected,
            isHashedSecretSetting,
            id,
            record,
        }) => {
            const url =
                isHashedSecretSetting && isPlainTextSelected
                    ? `${context.baseUrl}/admin/Portal.svc/GenerateNewSharedSecret?ApplicationUuid='${id}'&ShouldHash='false'`
                    : `${context.baseUrl}/admin/Portal.svc/GenerateNewSharedSecret?ApplicationUuid='${id}'`;
            const { json } = await context.fetchJson(url, {
                credentials: 'include',
            });
            return {
                data: {
                    id,
                    keySecret: json.d.result,
                },
            };
        },
    };
};
