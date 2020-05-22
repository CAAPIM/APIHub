const faker = require('faker');
const merge = require('lodash/merge');

function generateData() {
    const organizations = generateOrganisations();
    const tags = generateTags();
    const userContexts = generateUserContexts({ organizations });
    const apis = generateApis({ tags });
    const apiGroups = generateApiGroups();
    const applications = generateApplications({ apis });
    const documents = generateDocumentationForApis({ apis });
    const assets = generateAssetsForApis({ apis });
    const registrations = generateRegistrations();

    return {
        userContexts,
        apis,
        applications,
        tags,
        documents,
        assets,
        apiGroups,
        registrations,
    };
}

function generateOrganisations() {
    return Array.from(Array(5).keys()).map(() => ({
        uuid: faker.random.uuid(),
        name: faker.company.companyName(),
    }));
}

function generateUserContexts({ organizations }) {
    const portalAdmin = generateUserContext({
        organizations,
        userContexts: [
            {
                userDetails: {
                    username: 'portalAdmin',
                    portalAdmin: true,
                    orgPublisher: true,
                    apiOwner: true,
                },
            },
        ],
    });

    const orgPublisher = generateUserContext({
        organizations,
        userContexts: [
            {
                userDetails: {
                    username: 'orgPublisher',
                    orgPublisher: true,
                    apiOwner: true,
                },
            },
        ],
    });

    const apiOwner = generateUserContext({
        organizations,
        userContexts: [
            {
                userDetails: {
                    username: 'apiOwner',
                    apiOwner: true,
                },
            },
        ],
    });

    const user = generateUserContext({
        organizations,
        userContexts: [
            {
                userDetails: {
                    username: 'user',
                },
            },
        ],
    });

    return [portalAdmin, orgPublisher, apiOwner, user];
}

function generateUserContext({ organizations, ...data }) {
    const nbOrganisations = faker.random.number({ min: 1, max: 5 });
    const accessibleOrgs = faker.random.arrayElements(
        organizations,
        nbOrganisations
    );

    const uuid = faker.random.uuid();
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    return merge(
        {
            uuid,
            userContexts: [
                {
                    userDetails: {
                        uuid,
                        username: faker.internet.userName(firstName, lastName),
                        lastName,
                        firstName,
                        email: faker.internet.email(
                            firstName,
                            lastName,
                            'example.com'
                        ),
                        portalAdmin: false,
                        apiOwner: false,
                        orgPublisher: false,
                    },
                    activeOrgUuid: accessibleOrgs[0].uuid,
                    accessibleOrgs: accessibleOrgs.reduce(
                        (acc, org) => ({
                            ...acc,
                            [org.name]: org.uuid,
                        }),
                        {}
                    ),
                },
            ],
        },
        data
    );
}

function generateApis(data) {
    return Array.from(Array(25).keys()).map(() => generateApi(data));
}

function generateApi({ tags, ...data }) {
    const createTs = faker.date.past();
    const modifyTs = faker.date.recent();
    const uuid = faker.random.uuid();

    return merge(
        {
            id: uuid,
            uuid,
            name: faker.fake(
                '{{hacker.abbreviation}} {{name.jobDescriptor}} {{name.jobArea}}'
            ),
            description: faker.company.catchPhrase(),
            createTs: createTs.valueOf(),
            modifyTs: modifyTs.valueOf(),
            version: faker.system.semver(),
            ssgServiceType: faker.random.arrayElement(['SOAP', 'REST']),
            portalStatus: faker.random.arrayElement([
                'ENABLED',
                'DISABLED',
                'DEPRECATED',
                'UNPUBLISHED',
            ]),
            accessStatus: faker.random.arrayElement(['PUBLIC', 'PRIVATE']),
            tags: faker.random
                .arrayElements(tags, faker.random.number({ min: 1, max: 3 }))
                .map(({ name }) => name),
        },
        data
    );
}

function generateApiGroups(data) {
    return Array.from(Array(4).keys()).map(() => generateApiGroup(data));
}

function generateApiGroup(data) {
    const uuid = faker.random.uuid();

    return merge(
        {
            id: uuid,
            uuid,
            name: faker.fake('{{commerce.product}}'),
            description: faker.fake(
                '{{commerce.productName}} {{commerce.productAdjective}} {{commerce.productMaterial}}'
            ),
        },
        data
    );
}

function generateApplications({ apis }) {
    return Array.from(Array(25).keys()).map(() =>
        generateApplication({ apis })
    );
}

function generateApplication({ apis, ...data }) {
    const nbApis = faker.random.number({ min: 1, max: 5 });
    const uuid = faker.random.uuid();

    const apiKey = faker.random.uuid();
    const keySecret = faker.random.uuid();

    // This field won't be returned but will be used by the mock server
    const _accessibleApis = faker.random
        .arrayElements(apis, nbApis)
        .map(({ uuid }) => uuid);

    apis.filter(({ uuid }) => _accessibleApis.includes(uuid)).forEach(
        api => (api.applicationUsage = (api.applicationUsage || 0) + 1)
    );

    return merge(
        {
            id: uuid,
            uuid,
            name: faker.fake(
                '{{hacker.abbreviation}} {{name.jobDescriptor}} {{name.jobArea}}'
            ),
            status: faker.random.arrayElement([
                'ENABLED',
                'DISABLED',
                'DEPRECATED',
                'UNPUBLISHED',
                'REJECTED',
                'APPLICATION_PENDING_APPROVAL',
            ]),
            description: faker.company.catchPhrase(),
            OauthCallbackUrl: 'https://example.com/oauthCallback',
            OauthScope: 'OOB',
            OauthType: faker.random.arrayElement(['public', 'confidential']),
            apiKey,
            keySecret,
            apiIds: {
                results: _accessibleApis,
            },
            _accessibleApis,
        },
        data
    );
}

function generateTags() {
    return [
        { uuid: faker.random.uuid(), name: 'Accounts' },
        { uuid: faker.random.uuid(), name: 'Security' },
        { uuid: faker.random.uuid(), name: 'Plans' },
        { uuid: faker.random.uuid(), name: 'Organizations' },
    ];
}

function generateDocumentationForApis({ apis, ...data }) {
    const documents = apis.reduce((acc, api) => {
        acc.push(...generateDocumentationForApi({ api }));
        return acc;
    }, []);
    return documents;
}

function generateDocumentationForApi({ api, ...data }) {
    const nbRootDocuments = faker.random.number({ min: 0, max: 6 });
    let documents = [];

    for (let index = 0; index < nbRootDocuments; index++) {
        documents.push(
            ...generateDocumentsForApi({ api, ordinal: index, maxChild: 6 })
        );
    }
    return documents;
}

function generateDocumentsForApi({ api, maxChild, ...data }) {
    return ['en-US', 'fr-FR'].reduce((documents, locale) => {
        const title = `${locale} - ${faker.company.catchPhrase()}`;
        const document = {
            uuid: faker.random.uuid(),
            type: 'api',
            typeUuid: api.uuid,
            locale,
            status: 'PUBLISHED',
            title,
            navtitle: faker.helpers.slugify(title).toLowerCase(),
            markdown: faker.lorem.text(
                faker.random.number({ min: 1, max: 10 })
            ),
            ...data,
        };
        documents.push(document);

        const nbChildDocuments = faker.random.number({ min: 0, max: maxChild });
        for (let index = 0; index < nbChildDocuments; index++) {
            documents.push(
                ...generateDocumentsForApi({
                    api,
                    maxChild: maxChild - 2,
                    parentUuid: document.uuid,
                    ordinal: index,
                })
            );
        }

        return documents;
    }, []);
}

function generateAssetsForApis({ apis, ...data }) {
    const assets = apis.reduce((acc, api) => {
        acc.push(...generateAssetsForApi({ api }));
        return acc;
    }, []);
    return assets;
}

function generateAssetsForApi({ api }) {
    const nbAssets = faker.random.number({ min: 1, max: 5 });
    const assets = [];

    for (let index = 0; index < nbAssets; index++) {
        const uuid = faker.random.uuid();
        const name = faker.system.fileName();
        const fileName = `${name.substr(0, name.indexOf('.'))}.json`;

        assets.push({
            uuid,
            type: 'JSON',
            name: fileName,
            _apiUuid: api.uuid,
            links: [
                {
                    rel: 'file',
                    href: `/api-management/1.0/apis/${api.uuid}/assets/${uuid}/file`,
                },
            ],
        });
    }

    return assets;
}

function generateRegistrations() {
    return [];
}

module.exports = {
    generateData,
    generateOrganisations,
    generateUserContexts,
    generateUserContext,
    generateApis,
    generateApiGroups,
    generateApplications,
    generateRegistrations,
};
