import { promisify } from '../promisify';
import { Response } from 'miragejs';

const UuidRegexp = /ApiEulas\('(.*)'\)/;

export function getApiEula(database) {
    return async (schema, request) => {
        const matches = UuidRegexp.exec(request.params.path);

        if (matches && matches.length > 1) {
            const Uuid = matches[1];
            const eula = await promisify(
                database.apiEulas.findOne.bind(database.apiEulas),
                { Uuid }
            );

            if (eula) {
                return eula;
            }
        }

        return new Response(404);
    };
}
