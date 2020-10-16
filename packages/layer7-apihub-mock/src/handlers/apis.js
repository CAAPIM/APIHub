import { promisify } from '../promisify';
import specs from '../specs.json';
import { getCurrentUser } from './currentUser';

const SearchFields = ['name', 'description'];

export function listApis(database) {
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
            await promisify(database.apis.find(finalFilters).fetch)
        ).length;

        const results = await promisify(
            database.apis.find(finalFilters, {
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

export function getApi(database) {
    return async (schema, request) => {
        const { ssgServiceType, ...api } = await promisify(
            database.apis.findOne.bind(database.apis),
            { uuid: request.params.id },
            {}
        );

        return {
            ...api,
            apiServiceType: ssgServiceType,
        };
    };
}

export function listApiPermissions(database) {
    return (schema, request) => {
        const user = getCurrentUser();
        const {
            apiOwner,
            orgPublisher,
            portalAdmin,
        } = user.userContexts[0].userDetails;
        const hasRights = apiOwner || orgPublisher || portalAdmin;

        return {
            id: request.params.id,
            canEdit: hasRights,
            canDelete: hasRights,
        };
    };
}

export function getApiSpecContent(database) {
    return (schema, request) => {
        return specs;
    };
}
