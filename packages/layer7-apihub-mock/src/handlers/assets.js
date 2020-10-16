import { promisify } from '../promisify';

export function listApiAssets(database) {
    return async (schema, request) => {
        const assets = await promisify(
            database.assets.find({
                _apiUuid: request.params.id,
            }).fetch
        );

        return assets;
    };
}
