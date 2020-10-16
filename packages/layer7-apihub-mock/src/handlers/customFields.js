import { promisify } from '../promisify';

export function listCustomFields(database) {
    return (schema, request) => {
        return promisify(database.customFields.find(request.queryParams).fetch);
    };
}
