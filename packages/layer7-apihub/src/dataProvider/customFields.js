const basePath = '/api-management/1.0/custom-fields';
export const customFieldsDataProvider = context => {
    return {
        // The CustomFields API route does not care about pagination or sorting
        // so we ignore those parameters
        getList: async ({ entityName = 'APPLICATION', status = 'ENABLED' }) => {
            const url = new URL(`${context.apiUrl}${basePath}?entityType=${entityName}&status=${status}&size=2000`);
            const { json } = await context.fetchJson(url.toString(), {
                credentials: 'include',
            });

            if (!json) {
                return { data: [], total: 0 };
            }

            return {
                data:
                    json.results.map(({ uuid, ...item }) => ({
                        ...item,
                        id: uuid,
                    })) || [],
                total: json.totalElements,
            };
        },
    };
};
