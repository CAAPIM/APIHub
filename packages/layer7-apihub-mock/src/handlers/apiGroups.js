import { promisify } from '../promisify';
import { Response } from 'miragejs';

const UUID_REGEX = /eulas\/.*\//;
const SearchFields = ['name', 'description'];

export function listApiGroups(database) {
    return async (schema, request) => {
        const { page, size, order, sort, ...filter } = request.queryParams;

        const finalPage = parseInt(page, 10);
        const finalSize = parseInt(size, 10);
        const [finalSort, finalOrder] = sort ? sort.split(',') : [];

        let finalFilters = filter;
        if (Object.keys(filter).some(key => SearchFields.includes(key))) {
            const otherFilters = Object.keys(filter).filter(
                key => !SearchFields.includes(key)
            );
            finalFilters = otherFilters.reduce(
                (acc, key) => ({
                    ...acc,
                    [key]: filter[key],
                }),
                {
                    $or: SearchFields.map(field => ({
                        [field]: {
                            $regex: `.*${filter[field]}.*`,
                            $options: 'ig',
                        },
                    })),
                }
            );
        }

        const totalElements = (
            await promisify(database.apiGroups.find(finalFilters).fetch)
        ).length;

        const results = await promisify(
            database.apiGroups.find(finalFilters, {
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

export function getApiGroup(database) {
    return async (schema, request) => {
        const apiGroup = await promisify(
            database.apiGroups.findOne.bind(database.apiGroups),
            { uuid: request.params.id },
            {}
        );

        return apiGroup;
    };
}

export function getApiGroupApis(database) {
    return async (schema, request) => {
        const apiGroup = await promisify(
            database.apiGroups.findOne.bind(database.apiGroups),
            { uuid: request.params.id },
            {}
        );

        return apiGroup.apis.map(({ uuid }) => ({ uuid }));
    };
}

export function getApiGroupEula(database) {
    return async (schema, request) => {
        const matches = UUID_REGEX.exec(request.params.path);

        if (matches && matches.length > 1) {
            const uuid = matches[1];
            const eula = await promisify(
                database.apiEulas.findOne.bind(database.apiEulas),
                { uuid }
            );

            if (eula) {
                return eula;
            }
        }

        return new Response(404);
    };
}
