import { Model, Server } from 'miragejs';
import minimongo from 'minimongo';

import defaultData from './defaultData.json';
import {
    login,
    getPublicKey,
    resetPassword,
    checkUserNameIsUnique,
    passwordResetTokenValidate,
    updateMyPassword,
    logout,
    getAccountSetup,
    putAccountSetup,
    getUserContexts,
    putUserContexts,
    getCmsSettings,
    getAuthSchemes,
    getPasswordPolicy,
} from './handlers/authentication';
import { getUserProfile, putUserProfile } from './handlers/userProfile';
import { getTheme } from './handlers/branding';
import {
    listApis,
    getApi,
    listApiPermissions,
    getApiSpecContent,
} from './handlers/apis';
import {
    listApiGroups,
    getApiGroup,
    getApiGroupApis,
    getApiGroupEula,
} from './handlers/apiGroups';
import {
    listApiPlans,
    getApiPlan,
    getApiApiPlanAssociation,
    getApiPlansFeatureFlag,
} from './handlers/apiPlans';
import { listAccountPlans, getAccountPlan } from './handlers/accountPlans';
import {
    listApplications,
    getApplication,
    postApplication,
    getGenerateSharedSecret,
    getSecretHashMetadata,
    deleteApplication,
} from './handlers/applications';
import { listApiKeys } from './handlers/apiKeys';
import {
    listOrganizations,
    getOrganization,
    postOrganization,
    putOrganization,
    deleteOrganization,
} from './handlers/organizations';
import {
    getDocumentsTree,
    postDocument,
    putDocument,
    getDocument,
    putDocumentsTree,
    deleteDocument,
} from './handlers/documents';
import { listApiTags, listTags } from './handlers/tags';
import { listApiAssets } from './handlers/assets';
import { promisify } from './promisify';
import { deleteCurrentUser } from './handlers/currentUser';
import { postRegistration } from './handlers/registrations';

import { initializeRunningIndicator } from './running/indicator';
import { getMetricsHits, getMetricsLatency } from './handlers/metrics';
import { listCustomFields } from './handlers/customFields';
import { getApiEula } from './handlers/apiEulas';

let database;

const DefaultUrlPrefix = 'https://apim.dev.ca.com/';

/**
 * Starts a Mirage Server mocking all the ApiHub APIs. This server runs in the browser and intercepts
 * all requests made to the /api routes
 *
 * @param {options} Options The options
 * @param {options.data} data The default data used to populate the mock server
 * @param {options.urlPrefix} urlPrefix The base url for running the mock server
 * @param {options.showRunningIndicator} showRunningIndicator Show or hide the running indicator
 * @param {options.timing} timing The delay before responding
 */
export const startApiHubMockedServer = async (
    {
        data = defaultData,
        urlPrefix = DefaultUrlPrefix,
        showRunningIndicator = true,
        runningIndicatorLink = '#',
        ...options
    } = {
        timing: 150,
    }
) => {
    if (showRunningIndicator) {
        initializeRunningIndicator({ link: runningIndicatorLink });
    }

    database = await getDatabase();
    await initDatabase(database, data);

    // eslint-disable-next-line no-unused-vars
    const server = new Server({
        models: {
            userContexts: Model.extend(),
            apis: Model.extend(),
            applications: Model.extend(),
            documents: Model.extend(),
        },
        routes() {
            this.get(
                `${urlPrefix}api/apim/GenerateNewSharedSecret`,
                getGenerateSharedSecret(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/passwordResetTokenValidate`,
                passwordResetTokenValidate(database),
                options
            );

            this.put(
                `${urlPrefix}api/apim/v2/users/password/reset/:uuid`,
                updateMyPassword(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/ResetMyPassword()`,
                resetPassword(database),
                options
            );

            this.get(`${urlPrefix}api/apim/logout`, logout(database), options);

            this.post(
                `${urlPrefix}api/apim/authenticate/login`,
                login(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/UserNameUnique()`,
                checkUserNameIsUnique(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/accountSetup`,
                getAccountSetup(database),
                options
            );

            this.put(
                `${urlPrefix}api/apim/accountSetup`,
                putAccountSetup(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/authenticate/getPublicKey`,
                getPublicKey(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/public/auth/schemes/passwordpolicy`,
                getPasswordPolicy(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/userContexts`,
                getUserContexts(database),
                options
            );

            this.put(
                `${urlPrefix}api/apim/userContexts`,
                putUserContexts(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/userProfile`,
                getUserProfile(database),
                options
            );

            this.put(
                `${urlPrefix}api/apim/userProfile`,
                putUserProfile(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/branding/1.0/themes`,
                getTheme(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/api-management/1.0/apis`,
                listApis(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/api-management/1.0/applications`,
                listApplications(database),
                options
            );

            this.post(
                `${urlPrefix}api/apim/Applications`,
                postApplication(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/api-management/1.0/applications/:applicationUuid/api-keys`,
                listApiKeys(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/api-management/1.0/account-plans`,
                listAccountPlans(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/api-management/1.0/account-plans/:id`,
                getAccountPlan(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/document-service/1.0/docs/:type/:typeUuid/:navtitle`,
                getDocument(database),
                options
            );

            this.post(
                `${urlPrefix}api/apim/document-service/1.0/docs/:type/:typeUuid/:navtitle`,
                postDocument(database),
                options
            );

            this.put(
                `${urlPrefix}api/apim/document-service/1.0/docs/:type/:typeUuid/:navtitle`,
                putDocument(database),
                options
            );

            this.del(
                `${urlPrefix}api/apim/document-service/1.0/docs/:type/:typeUuid/:navtitle`,
                deleteDocument(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/document-service/1.0/docs/:type/:typeUuid`,
                getDocumentsTree(database),
                options
            );

            this.put(
                `${urlPrefix}api/apim/document-service/1.0/docs/:type/:typeUuid`,
                putDocumentsTree(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/api-management/1.0/apis/:id`,
                getApi(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/api-management/1.0/apis/:id/tags`,
                listApiTags(database),
                options
            );

            this.get(
                `${urlPrefix}tenant-admin/internal/organizations`,
                listOrganizations(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/api-management/1.0/organizations/:id`,
                getOrganization(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/api-management/1.0/apis/:id/assets`,
                listApiAssets(database),
                options
            );

            this.get(`${urlPrefix}api/apim/tags`, listTags(database), options);

            this.get(
                `${urlPrefix}api/apim/api-management/internal/permissions/apis/:id/permitted`,
                listApiPermissions(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/2.0/Apis`,
                async (schema, request) => {
                    const { results } = await listApis(database)(
                        schema,
                        request
                    );
                    return results;
                },
                options
            );

            this.get(
                `${urlPrefix}api/apim/api-management/internal/OrganizationApiGroups`,
                listApiGroups(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/api-management/1.0/api-groups/:id`,
                getApiGroup(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/api-management/1.0/api-groups/:id/apis`,
                getApiGroupApis(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/api-management/internal/ApiGroups/:id/Eulas`,
                getApiGroupEula(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/api-management/internal/api-plans`,
                listApiPlans(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/api-management/1.0/api-plans/:id`,
                getApiPlan(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/api-management/internal/api-plans`,
                getApiApiPlanAssociation(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/Settings('FEATURE_FLAG_API_PLANS')`,
                getApiPlansFeatureFlag(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/Settings('APP_SECRET_HASHING_METADATA')`,
                getSecretHashMetadata(database),
                options
            );

            this.delete(
                `${urlPrefix}api/apim/Applications(':uuid')`,
                deleteApplication(database),
                options
            );

            // This is the only way I found to make the SpecContent route work.
            // Its url looks like api/apim/2.0/Apis(':id')/SpecContent.
            // It seems either the parenthesises or the quotes make the route parameter
            // parsing fail.
            this.get(
                `${urlPrefix}api/apim/2.0/*path`,
                async (schema, request) => {
                    const path = request.params.path;

                    if (path.match(/Apis\('.*'\)\/SpecContent/)) {
                        return await getApiSpecContent(database)(
                            schema,
                            request
                        );
                    }

                    if (path.match(/Apis\('.*'\)/)) {
                        const uuid = path.substring(6, path.length - 13);

                        return await getApi(database)(schema, {
                            params: {
                                uuid,
                            },
                        });
                    }

                    return {};
                },
                options
            );

            this.post(
                `${urlPrefix}api/apim/Registrations`,
                postRegistration(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/cmsSettings`,
                getCmsSettings(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/public/auth/schemes`,
                getAuthSchemes(database),
                options
            );

            // api/apim/analytics/metrics/v1/hits/apis/by-week
            this.get(
                `${urlPrefix}api/apim/analytics/metrics/v1/hits/apis/:timeAggregation`,
                getMetricsHits(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/analytics/metrics/v1/latency/apis/:timeAggregation`,
                getMetricsLatency(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/CustomFields`,
                listCustomFields(database),
                options
            );

            // This is the only way I found to make the legacy routes work.
            // Its url looks api/apim/api-management/1.0/Applications(':uuid').
            // It seems either the parenthesises or the quotes make the route parameter
            // parsing fail.

            this.get(
                `${urlPrefix}api/apim/*path`,
                async (schema, request) => {
                    console.log('GET - Catch all', request.url);
                    const path = request.params.path;

                    if (path.match(/ApiEulas\('.*'\)/)) {
                        return await getApiEula(database)(schema, request);
                    }

                    if (path.match(/Applications\('.*'\)/)) {
                        const uuid = path.substring(14, path.length - 2);
                        return await getApplication(database)(schema, {
                            params: {
                                uuid,
                            },
                        });
                    }

                    return {};
                },
                options
            );

            this.put(
                `${urlPrefix}api/apim/*path`,
                async (schema, request) => {
                    console.log('PUT - Catch all', request.params.path);
                    const path = request.params.path;

                    if (path.match(/Organizations\('.*'\)/)) {
                        const uuid = path.substring(15, path.length - 2);
                        return await putOrganization(database)(schema, {
                            params: {
                                uuid,
                            },
                        });
                    }

                    return {};
                },
                options
            );

            this.post(
                `${urlPrefix}api/apim/*path`,
                async (schema, request) => {
                    console.log('POST - Catch all', request.params.path);
                    const path = request.params.path;

                    if (path.match(/Organizations\('.*'\)/)) {
                        const uuid = path.substring(15, path.length - 2);
                        return await postOrganization(database)(schema, {
                            params: {
                                uuid,
                            },
                        });
                    }

                    return {};
                },
                options
            );

            this.delete(
                `${urlPrefix}api/apim/*path`,
                async (schema, request) => {
                    console.log('DELETE - Catch all', request.params.path);
                    const path = request.params.path;

                    if (path.match(/Organizations\('.*'\)/)) {
                        const uuid = path.substring(15, path.length - 2);
                        return await deleteOrganization(database)(schema, {
                            params: {
                                uuid,
                            },
                        });
                    }

                    return {};
                },
                options
            );

            this.passthrough();
        },
    });

    window.Layer7Mock = {
        database,

        clearDatabase() {
            return clearDatabase();
        },

        initDatabase(initialData = data) {
            return initDatabase(database, initialData);
        },

        resetDatabase(initialData = data) {
            return this.clearDatabase().then(() =>
                this.initDatabase(initialData)
            );
        },

        deleteCurrentUser,
    };
    return { server, database };
};

async function getDatabase() {
    if (database) {
        return database;
    }

    return new Promise((resolve, reject) => {
        const indexedDb = new minimongo.IndexedDb(
            { namespace: 'layer7' },
            () => resolve(indexedDb),
            reject
        );
    });
}

async function clearDatabase() {
    await Promise.all([
        promisify(database.removeCollection.bind(database), 'apis'),
        promisify(database.removeCollection.bind(database), 'apiEulas'),
        promisify(database.removeCollection.bind(database), 'apiGroups'),
        promisify(database.removeCollection.bind(database), 'apiKeys'),
        promisify(database.removeCollection.bind(database), 'apiPlans'),
        promisify(database.removeCollection.bind(database), 'applications'),
        promisify(database.removeCollection.bind(database), 'userContexts'),
        promisify(database.removeCollection.bind(database), 'documents'),
        promisify(database.removeCollection.bind(database), 'specs'),
        promisify(database.removeCollection.bind(database), 'assets'),
        promisify(database.removeCollection.bind(database), 'tags'),
        promisify(database.removeCollection.bind(database), 'registrations'),
        promisify(database.removeCollection.bind(database), 'customFields'),
    ]);
    console.log('Mock database cleared');
}

async function initDatabase(db, initialData = defaultData) {
    await Promise.all([
        promisify(db.addCollection.bind(db), 'apis'),
        promisify(db.addCollection.bind(db), 'apiEulas'),
        promisify(db.addCollection.bind(db), 'apiGroups'),
        promisify(db.addCollection.bind(db), 'apiKeys'),
        promisify(db.addCollection.bind(db), 'apiPlans'),
        promisify(db.addCollection.bind(db), 'applications'),
        promisify(db.addCollection.bind(db), 'userContexts'),
        promisify(db.addCollection.bind(db), 'documents'),
        promisify(db.addCollection.bind(db), 'specs'),
        promisify(db.addCollection.bind(db), 'assets'),
        promisify(db.addCollection.bind(db), 'tags'),
        promisify(db.addCollection.bind(db), 'registrations'),
        promisify(db.addCollection.bind(db), 'customFields'),
    ]);

    const hasData = (await promisify(db.apis.find().fetch)).length > 0;

    if (!hasData) {
        await Promise.all([
            promisify(db.tags.upsert.bind(db.tags), initialData.tags),
            promisify(db.apis.upsert.bind(db.apis), initialData.apis),
            promisify(
                db.registrations.upsert.bind(db.registrations),
                initialData.registrations
            ),
            promisify(
                db.applications.upsert.bind(db.applications),
                initialData.applications
            ),
            promisify(
                db.apiGroups.upsert.bind(db.apiGroups),
                initialData.apiGroups
            ),
            promisify(
                db.apiGroups.upsert.bind(db.apiKeys),
                initialData.apiKeys
            ),
            promisify(
                db.apiPlans.upsert.bind(db.apiPlans),
                initialData.apiPlans
            ),
            promisify(
                db.userContexts.upsert.bind(db.userContexts),
                initialData.userContexts
            ),
            promisify(
                db.documents.upsert.bind(db.documents),
                initialData.documents
            ),
            promisify(db.assets.upsert.bind(db.assets), initialData.assets),
            promisify(
                db.customFields.upsert.bind(db.customFields),
                initialData.customFields
            ),
            promisify(
                db.apiEulas.upsert.bind(db.apiEulas),
                initialData.apiEulas
            ),
        ]);
    }
    console.log('Mock database initialized');
}
