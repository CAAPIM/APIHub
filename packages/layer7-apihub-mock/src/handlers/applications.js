import { promisify } from '../promisify';
import faker from 'faker';

export function listApplications(database) {
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

        const finalFilter = {
            ...filter,
        };

        if (apiUuid) {
            finalFilter._accessibleApis = apiUuid;
        }

        const totalElements = (
            await promisify(database.applications.find(finalFilter).fetch)
        ).length;
        const results = await promisify(
            database.applications.find(finalFilter, {
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

export function getApplication(database) {
    return async (schema, request) => {
        return await promisify(
            database.applications.findOne.bind(database.applications),
            { uuid: request.params.uuid },
            {}
        );
    };
}

export function getGenerateSharedSecret(database) {
    return {
        d: {
            result: faker.random.alphaNumeric(32),
        },
    };
}

export function getSecretHashMetadata(database) {
    return {
        Uuid: faker.random.uuid(),
        Name: 'APP_SECRET_HASHING_METADATA',
        Value: '{"algorithm":"SHA-512","plaintextAllowed":true}',
    };
}
