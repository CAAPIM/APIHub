import { apiGroupsDataProvider } from './apiGroups';
import { apisDataProvider } from './apis';
import { applicationsDataProvider } from './applications';
import { assetsDataProvider } from './assets';
import { specsDataProvider } from './specs';
import { tagsDataProvider } from './tags';
import { documentsDataProvider } from './documents';
import { registrationsDataProvider } from './registrations';
import { userContextsDataProvider } from './userContexts';

export const dataProvider = (baseUrl, tenantName) => {
    const adminUrl = `${baseUrl}/admin`;
    const apiUrl = `${baseUrl}/api/${tenantName}`;

    const resourcesMap = {
        apiGroups: apiGroupsDataProvider(apiUrl),
        apis: apisDataProvider(apiUrl, adminUrl),
        applications: applicationsDataProvider(apiUrl),
        assets: assetsDataProvider(apiUrl),
        tags: tagsDataProvider(apiUrl),
        specs: specsDataProvider(apiUrl),
        documents: documentsDataProvider(apiUrl),
        registrations: registrationsDataProvider(baseUrl),
        userContexts: userContextsDataProvider(apiUrl),
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
