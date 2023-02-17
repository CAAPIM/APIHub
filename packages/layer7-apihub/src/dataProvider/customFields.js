import { stringify } from 'query-string';

const basePath = '/CustomFields';

export const customFieldsDataProvider = context => {
    return {
        // The CustomFields API route does not care about pagination or sorting
        // so we ignore those parameters
        getList: async ({ filter, entityName = 'APPLICATION' }) => {
            filter = filter || {
                $inlinecount: 'allpages',
                $filter: `EntityType eq '${entityName}' and Status eq 'ENABLED'`,
            };
            const url = new URL(`${context.apiUrl}${basePath}`);
            url.search = stringify(filter);
            const { json } = await context.fetchJson(url.toString(), {
                credentials: 'include',
            });

            if (!json) {
                return { data: [], total: 0 };
            }

            return {
                data:
                    json.map(({ Uuid, ...item }) => ({
                        ...item,
                        id: Uuid,
                    })) || [],
                total: json.length,
            };
        },
    };
};
