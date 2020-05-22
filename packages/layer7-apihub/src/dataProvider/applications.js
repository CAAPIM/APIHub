import { fetchUtils } from 'ra-core';
import { stringify } from 'query-string';

const basePath = '/api-management/1.0/applications';
const legacyPath = '/Applications';
const apisListPath = '/2.0/Apis';

export const applicationsDataProvider = baseUrl => {
    return {
        getManyReference: async ({
            pagination = { page: 1, perPage: 25 },
            filter: { id },
        }) => {
            const url = `${baseUrl}${basePath}?${stringify({
                apiUuid: id,
                page: pagination.page - 1,
                size: pagination.perPage,
            })}`;

            const { json } = await fetchUtils.fetchJson(url, {
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
            pagination = { page: 1, perPage: 25 },
            sort = null,
        }) => {
            const url = `${baseUrl}${basePath}?${stringify({
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
                        id: uuid,
                        ...item,
                    })) || [],
                total: json.totalElements || 0,
            };
        },

        getOne: async ({ id }) => {
            const url = `${baseUrl}${legacyPath}('${id}')`;

            const {
                json: { Uuid, ...data },
            } = await fetchUtils.fetchJson(url, { credentials: 'include' });

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
                    ...data,
                },
            };
        },

        getSecretHashMetadata: async () => {
            // const url = `${portal.hostname}/api/${portal.tenantPrefix}/Settings('APP_SECRET_HASHING_METADATA')`;
            const url = `${baseUrl}/Settings('APP_SECRET_HASHING_METADATA')`;
            const {
                json: { Uuid, ...data },
            } = await fetchUtils.fetchJson(url, {
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
            url: apiHubUrl,
            record,
        }) => {
            const url =
                isHashedSecretSetting && isPlainTextSelected
                    ? `${apiHubUrl}/admin/Portal.svc/GenerateNewSharedSecret?ApplicationUuid='${id}'&ShouldHash='false'`
                    : `${apiHubUrl}/admin/Portal.svc/GenerateNewSharedSecret?ApplicationUuid='${id}'`;
            const { json } = await fetchUtils.fetchJson(url, {
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
