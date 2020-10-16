import { promisify } from '../promisify';
import { Response } from 'miragejs';

export function listApiTags(database) {
    return async (schema, request) => {
        const api = await promisify(database.apis.findOne.bind(database.apis), {
            uuid: request.params.id,
        });

        if (!api) {
            return new Response(404);
        }

        const tags = await promisify(
            database.tags.find({
                name: {
                    $in: api.tags,
                },
            }).fetch
        );

        return tags;
    };
}

export function listTags(database) {
    return async (schema, request) => {
        const tags = await promisify(database.tags.find().fetch);
        return tags;
    };
}
