import { stringify } from 'query-string';

export const applicationCertificatesDataProvider = context => {
    const basePath = `${context.apiUrl}/api-management/1.0/applications`;
    return {
        getList: async ({ applicationUuid, filter = {} }) => {
            const path = `${basePath}/${applicationUuid}/certificates`;
            const url = `${path}?${stringify({
                ...filter,
            })}`;

            const { json: data } = await context.fetchJson(url, {
                credentials: 'include',
            });

            return {
                data:
                    data.map(({ uuid, ...item }) => ({ id: uuid, ...item })) ||
                    [],
                total: data.length || 0,
            };
        },
        create: async ({ appUuid, data }) => {
            const path = `${basePath}/${appUuid}/certificates`;
            const { json } = await context.fetchJson(path, {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify({ ...data, applicationUuid: appUuid }),
            });
            return {
                data: {
                    ...json,
                    id: json.uuid,
                },
            };
        },
        delete: async ({ applicationUuid, certificateUuid }) => {
            const path = `${basePath}/${applicationUuid}/certificates/${certificateUuid}`;

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
    };
};
