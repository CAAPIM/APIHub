const basePath = '/admin/Portal.svc/Registrations';

const prepareCreateData = ({ ...body }) => JSON.stringify(body);

export const registrationsDataProvider = context => {
    return {
        create: async ({ data, ...body }) => {
            const url = `${context.baseUrl}${basePath}`;

            const { json } = await context.fetchJson(url, {
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
