import faker from 'faker';
import { promisify } from '../promisify';

export function listOrganizations(database) {
    return async (schema, request) => {
        return await promisify(database.organizations.find().fetch);
    };
}

export function getOrganization(database) {
    return async (schema, request) => {
        const { uuid } = request.params;

        const organization = await promisify(
            database.organizations.findOne.bind(database.organizations),
            {
                uuid,
            }
        );

        if (!organization) {
            return new Response(404);
        }

        return organization;
    };
}

export function postOrganization(database) {
    return async (schema, request) => {
        const organization = JSON.parse(request.requestBody);

        await promisify(
            database.organizations.upsert.bind(database.organizations),
            {
                ...organization,
                uuid: faker.random.uuid(),
            }
        );

        return request.requestBody;
    };
}

export function putOrganization(database) {
    return async (schema, request) => {
        const organization = JSON.parse(request.requestBody);

        await promisify(
            database.organizations.upsert.bind(database.organizations),
            {
                ...organization,
            }
        );

        return request.requestBody;
    };
}

export function deleteOrganization(database) {
    return async (schema, request) => {
        const { uuid } = request.params;

        const organization = await promisify(
            database.organizations.findOne.bind(database.organizations),
            {
                uuid,
            }
        );

        await promisify(
            database.organizations.remove.bind(database.organizations),
            organization._id
        );

        return organization;
    };
}
