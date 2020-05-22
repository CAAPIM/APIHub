import { Response } from 'miragejs';
import { promisify } from '../promisify';

export function postRegistration(database) {
    return async (schema, request) => {
        const registration = JSON.parse(request.requestBody);

        await promisify(
            database.registrations.upsert.bind(database.registrations),
            {
                ...registration,
            }
        );

        return new Response(201, {}, {});
    };
}
