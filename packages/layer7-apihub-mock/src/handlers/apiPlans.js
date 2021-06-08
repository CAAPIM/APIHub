import { promisify } from '../promisify';
import { Response } from 'miragejs';
import faker from 'faker';

export function listApiPlans(database) {
    return async (schema, request) => {
        const totalElements = (await promisify(database.apiPlans.find().fetch))
            .length;

        return await promisify(database.apiPlans.find().fetch);
    };
}

export function getApiPlan(database) {
    return async (schema, request) => {
        const { apis, ...apiPlan } = await promisify(
            database.apiPlans.findOne.bind(database.apiPlans),
            { uuid: request.params.id },
            {}
        );

        return apiPlan;
    };
}

export function getApiPlanApis(database) {
    return async (schema, request) => {
        const apiPlan = await promisify(
            database.apiPlans.findOne.bind(database.apiPlans),
            { uuid: request.params.id },
            {}
        );

        return apiPlan.apis.map(({ uuid }) => ({ uuid }));
    };
}

export function getApiApiPlanAssociation(database) {
    return async (schema, request) => {
        const apiPlan = await promisify(
            database.apiPlans.findOne.bind(database.apiPlans),
            { uuid: request.params.api_plan_id },
            {}
        );

        const hasAssociation = !!apiPlan.apis.find(
            api => request.params.api_id === api
        );

        if (hasAssociation) {
            return '0';
        } else {
            return new Response(
                404,
                {},
                {
                    error: {
                        code: '404',
                        message: {
                            lang: 'en-US',
                            value: 'association not found',
                        },
                    },
                }
            );
        }
    };
}

export function getApiPlansFeatureFlag(database) {
    return {
        CreateTs: 0,
        Uuid: faker.random.uuid(),
        CreatedBy: 'SYSTEM',
        ModifyTs: 0,
        Value: true,
        Name: 'FEATURE_FLAG_API_PLANS',
    };
}
