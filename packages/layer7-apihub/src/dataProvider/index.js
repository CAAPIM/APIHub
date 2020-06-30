import { apiGroupsDataProvider } from './apiGroups';
import { apisDataProvider } from './apis';
import { applicationsDataProvider } from './applications';
import { assetsDataProvider } from './assets';
import { specsDataProvider } from './specs';
import { tagsDataProvider } from './tags';
import { documentsDataProvider } from './documents';
import { registrationsDataProvider } from './registrations';
import { userContextsDataProvider } from './userContexts';
import { getFetchJson } from '../fetchUtils';

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
        apiGroups: apiGroupsDataProvider(context),
        apis: apisDataProvider(context),
        applications: applicationsDataProvider(context),
        assets: assetsDataProvider(context),
        tags: tagsDataProvider(context),
        specs: specsDataProvider(context),
        documents: documentsDataProvider(context),
        registrations: registrationsDataProvider(context),
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
