// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { stringify } from 'query-string';
import { get, isEmpty } from 'lodash';

export const applicationsDataProvider = context => {
    const basePath = `${context.apiUrl}/api-management/1.0/applications`;
    const apiPlansBasePath = `${context.apiUrl}/api-management/0.1/applications`;

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
                sort: `${sort.field},${sort.order}`,
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
                totalPages: json.totalPages,
            };
        },
        getOne: async ({ id }) => {
            const appURL = `${basePath}/${id}`;
            const customFieldsURL = `${appURL}/custom-fields`;

            let [appResult, cfResult] = await Promise.all([
                context.fetchJson(appURL, { credentials: 'include' }),
                context.fetchJson(customFieldsURL, { credentials: 'include' }),
            ]);

            const {
                json: { uuid, ...data },
            } = appResult;
            const { json: customFieldVals } = cfResult;
            return {
                data: {
                    id: uuid,
                    name: data.name,
                    description: data.description,
                    status: data.status,
                    organizationUuid: data.organizationUuid,
                    organizationName: data.organizationName,
                    disabledByType: data.DisabledByType,
                    customFieldValues: customFieldVals || [],
                },
            };
        },

        create: async ({ data }) => {
            const url = `${basePath}`;
            const {
                json: { uuid, ...responseData },
            } = await context.fetchJson(url, {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(data),
            });

            return {
                data: {
                    id: uuid,
                    name: responseData.name,
                    description: responseData.description,
                    status: responseData.status,
                    organizationUuid: responseData.organizationUuid,
                },
            };
        },

        update: async ({ id, data, meta }) => {
            const {
                keyId,
                options: { type = 'details' },
            } = meta;
            let appURL;
            if (type === 'custom-fields') {
                appURL = `${basePath}/${id}/custom-fields`;
            } else if (type === 'api-groups') {
                appURL = `${basePath}/${id}/api-groups`;
            } else if (type === 'apis') {
                appURL = `${basePath}/${id}/apis`;
            } else if (type === 'api-plans') {
                appURL = `${apiPlansBasePath}/${id}/api-plans`;
            } else if (type === 'api-keys') {
                appURL = `${basePath}/${id}/api-keys/${keyId}`;
            } else if (type === 'oauth-clients') {
                appURL = `${apiPlansBasePath}/${id}/oauth/clients/${keyId}`;
            } else if (type === 'publish') {
                appURL = `${basePath}/${id}/publish`;
            } else {
                appURL = `${basePath}/${id}`;
            }
            const { json } = await context.fetchJson(appURL, {
                credentials: 'include',
                method: 'PUT',
                body: JSON.stringify(data),
            });
            return {
                data: {
                    ...json,
                    id: id,
                },
            };
        },

        generateSecret: async ({ apiKey, appUuid, keySecretHashed }) => {
            let secretGenerateURL = `${basePath}/${appUuid}/api-keys/${apiKey}/secret`;
            const payload = {
                keySecret: '',
                keySecretHashed: keySecretHashed,
            };
            const responseData = await context.fetchJson(secretGenerateURL, {
                body: JSON.stringify(payload),
                credentials: 'include',
                method: 'PATCH',
            });
            const { json: data } = responseData;
            return {
                data,
            };
        },

        getApis: async ({ id }) => {
            let apisURL = `${basePath}/${id}/apis`;
            const responseData = await context.fetchJson(apisURL, {
                credentials: 'include',
            });
            const { json: data } = responseData;
            return {
                data: data,
            };
        },

        getApiGroups: async ({ id }) => {
            let apiGroupsURL = `${basePath}/${id}/api-groups`;
            const responseData = await context.fetchJson(apiGroupsURL, {
                credentials: 'include',
            });
            const { json: data } = responseData;
            return {
                data: data,
            };
        },

        getApiApiPlanIds: async ({ id }) => {
            let apiPlansURL = `${apiPlansBasePath}/${id}/api-plans`;
            const responseData = await context.fetchJson(apiPlansURL, {
                credentials: 'include',
            });
            const { json: data } = responseData;
            return {
                data: data,
            };
        },

        getRequestStatus: async ({ id }) => {
            let requestStatusURL = `${basePath}/${id}/request-status`;
            const responseData = await context.fetchJson(requestStatusURL, {
                credentials: 'include',
            });
            const { json: data } = responseData;
            return {
                data: data,
            };
        },

        getSecretHashMetadata: async () => {
            const url = `${context.apiUrl}/tenant-admin/1.0/settings/APP_SECRET_HASHING_METADATA`;
            const {
                json: { uuid, ...data },
            } = await context.fetchJson(url, {
                credentials: 'include',
            });
            return {
                data: {
                    id: uuid,
                    name: data.name,
                    value: data.value,
                },
            };
        },

        getKeyExpirySettings: async () => {
            const url = `${context.apiUrl}/tenant-admin/1.0/settings/APPLICATION_API_KEY_EXPIRY`;
            const { json } = await context.fetchJson(url, {
                credentials: 'include',
            });
            const settingsValue = JSON.parse(get(json, 'value', '{}'));
            return {
                data: {
                    ...settingsValue,
                },
            };
        },

        checkApplicationUniqueness: async ({
            applicationName,
            organizationUuid,
            uuid,
        }) => {
            const params = {
                name: applicationName,
                organizationUuid: organizationUuid,
                uuid,
            };
            const url = `${basePath}/unique-name?${stringify(params)}`;
            const { json } = await context
                .fetchJson(url, {
                    credentials: 'include',
                })
                .catch();
            return {
                data: {
                    isNameUnique: json && json.result,
                },
            };
        },

        delete: async ({ id, meta }) => {
            const queryStr = isEmpty(meta) ? '' : `?${stringify(meta)}`;
            const url = `${basePath}/${id}${queryStr}`;

            const {
                json: { ...data },
            } = await context
                .fetchJson(url, {
                    credentials: 'include',
                    method: 'DELETE',
                })
                .catch();

            return {
                data: { data },
            };
        },
    };
};
