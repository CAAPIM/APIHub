const basePath = '/v2/users/registrations';

const prepareCreateData = ({ ...body }) => JSON.stringify(body);

export const registrationsDataProvider = context => {
    return {
        create: async ({ data, ...body }) => {
            const url = `${context.apiUrl}${basePath}`;

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
