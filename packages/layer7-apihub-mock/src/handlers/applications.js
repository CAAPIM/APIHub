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
        return await promisify(
            database.applications.findOne.bind(database.applications),
            { uuid: request.params.uuid },
            {}
        );
    };
}

export function getGenerateSharedSecret(database) {
    return (schema, request) => {
        return {
            d: {
                result: faker.random.alphaNumeric(32),
            },
        };
        // To test Error Scenario
        // return new Response(405, undefined, {
        //     error : {
        //         code : "MethodNotAllowedException",
        //         message : {
        //             lang : "en-US",
        //             value : "Method Not Allowed"
        //         }
        //     }
        // });
    };
}

export function getSecretHashMetadata(database) {
    return {
        Uuid: faker.random.uuid(),
        Name: 'APP_SECRET_HASHING_METADATA',
        Value: '{"algorithm":"SHA-512","plaintextAllowed":true}',
    };
}

export function postApplication(database) {
    return async (schema, request) => {
        const uuid = faker.random.uuid();
        const application = {
            ...JSON.parse(request.requestBody),
            Uuid: uuid,
            uuid: uuid,
            id: uuid,
            status: 'Enabled',
            Status: 'Enabled',
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
