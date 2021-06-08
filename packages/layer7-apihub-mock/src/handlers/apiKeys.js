import { Response } from 'miragejs';
import { promisify } from '../promisify';
import faker from 'faker';

export function listApiKeys(database) {
    return async (schema, request) => {
        const {
            page,
            size,
            order,
            sort,
            name,
            $select,
            ...filter
        } = request.queryParams;

        const finalPage = parseInt(request.queryParams.page, 10);
        const finalSize = parseInt(request.queryParams.size, 10);
        const [finalSort, finalOrder] = request.queryParams.sort?.split(',') || [];

        const finalFilter = {
            ...filter,
        };

        const totalElements = (
            await promisify(database.apiKeys.find(finalFilter).fetch)
        ).length;

        const results = await promisify(
            database.apiKeys.find(finalFilter, {
                limit: finalSize,
                skip: finalSize * finalPage,
                sort: {
                    [finalSort]: finalOrder?.toLowerCase() === 'asc' ? 1 : -1,
                },
            }).fetch
        );

        return {
            results: results,
            totalElements,
        };
    };
}
