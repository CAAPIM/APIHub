import { promisify } from '../promisify';

export function listAccountPlans(database) {
    return async (schema, request) => {
        const {
            page,
            size,
            order,
            sort,
            apiUuid,
            $select,
            ...filter
        } = request.queryParams;

        const finalPage = parseInt(request.queryParams.page, 10);
        const finalSize = parseInt(request.queryParams.size, 10);
        const [finalSort, finalOrder] = request.queryParams.sort?.split(',');

        const totalElements = (
            await promisify(database.accountPlans.find(filter).fetch)
        ).length;
        const results = await promisify(
            database.accountPlans.find(filter, {
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

export function getAccountPlan(database) {
    return async (schema, request) => {
        return await promisify(
            database.accountPlans.findOne.bind(database.accountPlans),
            {
                uuid: request.params.id,
            },
            {}
        );
    };
}
