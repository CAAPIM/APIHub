import { fetchUtils } from 'ra-core';

const basePath = '/admin/Portal.svc/Registrations';

const prepareCreateData = ({ ...body }) => JSON.stringify(body);

export const registrationsDataProvider = baseUrl => {
    return {
        create: async ({ data, ...body }) => {
            const url = `${baseUrl}${basePath}`;

            const { json } = await fetchUtils.fetchJson(url, {
                credentials: 'include',
                method: 'POST',
                body: prepareCreateData(body),
            });

            return {
                data: { ...json },
            };
        },
    };
};
