import { promisify } from '../promisify';
import { Response } from 'miragejs';

const UUID_REGEX = /eulas\/.*\//;

export function getApiEula(database) {
    return async (schema, request) => {
        const matches = UUID_REGEX.exec(request.params.path);

        if (matches && matches.length > 1) {
            const uuid = matches[1];
            const eula = await promisify(
                database.apiEulas.findOne.bind(database.apiEulas),
                { uuid : uuid }
            );

            if (eula) {
                return eula;
            }
        }

        return new Response(404);
    };
}
