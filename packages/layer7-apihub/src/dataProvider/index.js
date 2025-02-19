import { getFetchJson } from '../fetchUtils';

import { accountPlansDataProvider } from './accountPlans';
import { apiEulasDataProvider } from './apiEulas';
import { apiGroupsDataProvider } from './apiGroups';
import { apiPlansDataProvider } from './apiPlans';
import { apisDataProvider } from './apis';
import { applicationCertificatesDataProvider } from './applicationCertificates';
import { apiKeysDataProvider } from './apiKeys';
import { oAuthClientsDataProvider } from './oAuthClients';
import { applicationsDataProvider } from './applications';
import { assetsDataProvider } from './assets';
import { authProvidersDataProvider } from './authProviders';
import { authProviderClientDefinitionsDataProvider } from './authProviderClientDefinitions';
import { customFieldsDataProvider } from './customFields';
import { documentsDataProvider } from './documents';
import { organizationsDataProvider } from './organizations';
import { registrationsDataProvider } from './registrations';
import { specsDataProvider } from './specs';
import { tagsDataProvider } from './tags';
import { userContextsDataProvider } from './userContexts';
import { userProfilesDataProvider } from './userProfiles';

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
        originHubName,
    };

    const resourcesMap = {
        accountPlans: accountPlansDataProvider(context),
        apiEulas: apiEulasDataProvider(context),
        apiGroups: apiGroupsDataProvider(context),
        apiPlans: apiPlansDataProvider(context),
        apis: apisDataProvider(context),
        apiKeys: apiKeysDataProvider(context),
        oAuthClients : oAuthClientsDataProvider(context),
        applicationCertificates: applicationCertificatesDataProvider(context),
        applications: applicationsDataProvider(context),
        assets: assetsDataProvider(context),
        authProviders: authProvidersDataProvider(context),
        authProviderClientDefinitions: authProviderClientDefinitionsDataProvider(context),
        customFields: customFieldsDataProvider(context),
        documents: documentsDataProvider(context),
        organizations: organizationsDataProvider(context),
        registrations: registrationsDataProvider(context),
        specs: specsDataProvider(context),
        tags: tagsDataProvider(context),
        userContexts: userContextsDataProvider(context),
        userProfiles: userProfilesDataProvider(context),
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
