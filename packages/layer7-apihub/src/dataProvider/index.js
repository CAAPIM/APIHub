import { getFetchJson } from '../fetchUtils';

import { accountPlansDataProvider } from './accountPlans';
import { apiEulasDataProvider } from './apiEulas';
import { apiGroupsDataProvider } from './apiGroups';
import { apiPlansDataProvider } from './apiPlans';
import { apisDataProvider } from './apis';
import { applicationsDataProvider } from './applications';
import { assetsDataProvider } from './assets';
import { customFieldsDataProvider } from './customFields';
import { documentsDataProvider } from './documents';
import { organizationsDataProvider } from './organizations';
import { registrationsDataProvider } from './registrations';
import { specsDataProvider } from './specs';
import { tagsDataProvider } from './tags';
import { userContextsDataProvider } from './userContexts';

export const dataProvider = (
    baseUrl,
    tenantName,
    originHubName,
    fetchJson = getFetchJson(originHubName)
) => {
    const context = {
        baseUrl,
        adminUrl: `${baseUrl}/admin`,
        apiUrl: `${baseUrl}/api/${tenantName}`,
        fetchJson,
    };

    const resourcesMap = {
        accountPlans: accountPlansDataProvider(context),
        apiEulas: apiEulasDataProvider(context),
        apiGroups: apiGroupsDataProvider(context),
        apiPlans: apiPlansDataProvider(context),
        apis: apisDataProvider(context),
        applications: applicationsDataProvider(context),
        assets: assetsDataProvider(context),
        customFields: customFieldsDataProvider(context),
        documents: documentsDataProvider(context),
        organizations: organizationsDataProvider(context),
        registrations: registrationsDataProvider(context),
        specs: specsDataProvider(context),
        tags: tagsDataProvider(context),
        userContexts: userContextsDataProvider(context),
    };

    const proxy = new Proxy(fakeDataProvider, {
        get: (target, name) => {
            return (resource, params) => {
                let resourceDataProvider = resourcesMap[resource];

                if (!resourceDataProvider) {
                    throw new Error(`Invalid resource "${resource}"`);
                }

                if (!resourceDataProvider[name]) {
                    throw new Error(
                        `Invalid action "${name}" for resource "${resource}"`
                    );
                }

                return resourceDataProvider[name](params);
            };
        },
    });

    return proxy;
};

// Only used to configure the proxy
const fakeDataProvider = {
    create: () => Promise.resolve(null),
    delete: () => Promise.resolve(null),
    deleteMany: () => Promise.resolve(null),
    getList: () => Promise.resolve(null),
    getMany: () => Promise.resolve(null),
    getManyReference: () => Promise.resolve(null),
    getOne: () => Promise.resolve(null),
    update: () => Promise.resolve(null),
    updateMany: () => Promise.resolve(null),
};
