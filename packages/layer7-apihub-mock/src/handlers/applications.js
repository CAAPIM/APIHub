import { Response } from 'miragejs';
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
            name,
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
        const applications = results.map(r => {
            const result = {};
            const keys = Object.keys(r);
            keys.map(k => {
                result[k.toLowerCase()] = r[k];
            });
            return result;
        });

        return {
            results: applications,
            totalElements,
        };
    };
}

export function getApplication(database) {
    return async (schema, request) => {
        const application = await promisify(
            database.applications.findOne.bind(database.applications),
            { uuid: request.params.uuid },
            {}
        );
        const keys = Object.keys(application);
        keys.map(k => {
            application[`${k[0].toUpperCase()}${k.slice(1)}`] = application[k];
        });

        return application;
    };
}

export function getSecretHashMetadata(database) {
    return {
        name: 'APP_SECRET_HASHING_METADATA',
        value: '{"algorithm":"SHA-512","plaintextAllowed":true}',
    };
}

export function postApplication(database) {
    return async (schema, request) => {
        const uuid = faker.random.uuid();
        const application = {
            ...JSON.parse(request.requestBody),
            uuid: uuid,
            id: uuid,
            status: 'Enabled',
        };

        await promisify(
            database.applications.upsert.bind(database.applications),
            { ...application }
        );

        return application;
    };
}

export function deleteApplication(database) {
    return async (schema, request) => {
        const { uuid } = request.params;

        const application = await promisify(
            database.applications.findOne.bind(database.applications),
            { uuid: uuid },
            {}
        );

        await promisify(
            database.applications.remove.bind(database.applications),
            application._id
        );

        return application;
    };
}
