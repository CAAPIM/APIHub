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
} from './handlers/authentication';
import { getTheme } from './handlers/branding';
import {
    listApis,
    getApi,
    listApiPermissions,
    getApiSpecContent,
} from './handlers/apis';
import { listApiGroups } from './handlers/apiGroups';
import {
    listApplications,
    getApplication,
    getGenerateSharedSecret,
    getSecretHashMetadata,
} from './handlers/applications';
import {
    listDocuments,
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
        ...options
    } = {
        timing: 150,
    }
) => {
    if (showRunningIndicator) {
        initializeRunningIndicator();
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
                `${urlPrefix}admin/Portal.svc/GenerateNewSharedSecret`,
                getGenerateSharedSecret(database),
                options
            );

            this.get(
                `${urlPrefix}/admin/passwordResetTokenValidate`,
                passwordResetTokenValidate(database),
                options
            );

            this.post(
                `${urlPrefix}/admin/UpdateMyPassword`,
                updateMyPassword(database),
                options
            );

            this.get(
                `${urlPrefix}/admin/Portal.svc/ResetMyPassword()`,
                resetPassword(database),
                options
            );

            this.get(`${urlPrefix}/admin/logout`, logout(database), options);

            this.post(
                `${urlPrefix}api/apim/authenticate/login`,
                login(database),
                options
            );

            this.get(
                `${urlPrefix}api/admin/Portal.svc/UserNameUnique()`,
                checkUserNameIsUnique(database),
                options
            );

            this.get(
                `${urlPrefix}api/admin/accountSetup`,
                getAccountSetup(database),
                options
            );

            this.put(
                `${urlPrefix}/admin/accountSetup`,
                putAccountSetup(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/authenticate/getPublicKey`,
                getPublicKey(database),
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
                `${urlPrefix}api/apim/api-management/1.0/apis/:id/assets`,
                listApiAssets(database),
                options
            );

            this.get(`${urlPrefix}api/apim/tags`, listTags(database), options);

            this.get(
                `${urlPrefix}admin/api-management/internal/permissions/apis/:id/permitted`,
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
                `${urlPrefix}api/apim/api-management/1.0/api-groups`,
                listApiGroups(database),
                options
            );

            this.get(
                `${urlPrefix}api/apim/Settings('APP_SECRET_HASHING_METADATA')`,
                getSecretHashMetadata(database),
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

            // This is the only way I found to make the Applications route work.
            // Its url looks api/apim/api-management/1.0/Applications(':uuid').
            // It seems either the parenthesises or the quotes make the route parameter
            // parsing fail.
            this.get(
                `${urlPrefix}api/apim/*path`,
                async (schema, request) => {
                    const path = request.params.path;

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

            this.post(
                `${urlPrefix}/admin/Portal.svc/Registrations`,
                postRegistration(database),
                options
            );

            this.passthrough();
        },
    });

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

async function initDatabase(db, initialData = defaultData) {
    await Promise.all([
        promisify(db.addCollection.bind(db), 'apis'),
        promisify(db.addCollection.bind(db), 'apiGroups'),
        promisify(db.addCollection.bind(db), 'applications'),
        promisify(db.addCollection.bind(db), 'userContexts'),
        promisify(db.addCollection.bind(db), 'documents'),
        promisify(db.addCollection.bind(db), 'specs'),
        promisify(db.addCollection.bind(db), 'assets'),
        promisify(db.addCollection.bind(db), 'tags'),
        promisify(db.addCollection.bind(db), 'registrations'),
    ]);

    const hasData = (await promisify(db.apis.find().fetch)).length > 0;

    if (!hasData) {
        await promisify(db.tags.upsert.bind(db.tags), initialData.tags);
        await promisify(db.apis.upsert.bind(db.apis), initialData.apis);
        await promisify(
            db.registrations.upsert.bind(db.registrations),
            initialData.registrations
        );

        await promisify(
            db.applications.upsert.bind(db.applications),
            initialData.applications
        );

        await promisify(
            db.apiGroups.upsert.bind(db.apiGroups),
            initialData.apiGroups
        );

        await promisify(
            db.userContexts.upsert.bind(db.userContexts),
            initialData.userContexts
        );
        await promisify(
            db.documents.upsert.bind(db.documents),
            initialData.documents
        );
        await promisify(db.assets.upsert.bind(db.assets), initialData.assets);
    }
}

window.Layer7Mock = {
    database,

    async clearDatabase() {
        const db = await getDatabase();
        return Promise.all([
            promisify(db.removeCollection.bind(db), 'apis'),
            promisify(db.removeCollection.bind(db), 'apiGroups'),
            promisify(db.removeCollection.bind(db), 'applications'),
            promisify(db.removeCollection.bind(db), 'userContexts'),
            promisify(db.removeCollection.bind(db), 'documents'),
            promisify(db.removeCollection.bind(db), 'specs'),
            promisify(db.removeCollection.bind(db), 'assets'),
            promisify(db.removeCollection.bind(db), 'tags'),
            promisify(db.removeCollection.bind(db), 'registrations'),
        ]);
    },

    async initDatabase(initialData) {
        const db = await getDatabase();
        return initDatabase(db, initialData);
    },

    resetDatabase() {
        this.clearDatabase();
        this.initDatabase();
    },

    deleteCurrentUser,
};
