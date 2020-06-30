import { promisify } from '../promisify';

export function listApiGroups(database) {
    return async (schema, request) => {
        const { page, size, order, sort, ...filter } = request.queryParams;

        const finalPage = parseInt(page, 10);
        const finalSize = parseInt(size, 10);
        const [finalSort, finalOrder] = sort ? sort.split(',') : [];

        const totalElements = (
            await promisify(database.apiGroups.find(filter).fetch)
        ).length;

        const results = await promisify(
            database.apiGroups.find(filter, {
                limit: finalSize,
                skip: finalSize * finalPage,
                sort: {
                    [finalSort]: finalOrder?.toLowerCase() === 'asc' ? 1 : -1,
                },
            }).fetch
        );

        return {
            results,
            totalElements,
        };
    };
}

export function getApiGroup(database) {
    return async (schema, request) => {
        const apiGroup = await promisify(
            database.apiGroups.findOne.bind(database.apiGroups),
            { uuid: request.params.id },
            {}
        );

        return apiGroup;
    };
}

export function getApiGroupApis(database) {
    return async (schema, request) => {
        const apiGroup = await promisify(
            database.apiGroups.findOne.bind(database.apiGroups),
            { uuid: request.params.id },
            {}
        );

        return apiGroup.apis.map(({ uuid }) => ({ uuid }));
    };
}
