const faker = require('faker');
const merge = require('lodash/merge');

function generateData() {
    const accountPlans = generateAccountPlans();
    const organizations = generateOrganizations({ accountPlans });
    const tags = generateTags();
    const userContexts = generateUserContexts({ organizations });
    const apiEulas = generateApiEulas();
    const apis = generateApis({ tags, apiEulas });
    const apiGroups = generateApiGroups({ apis });
    const applications = generateApplications({ apis });
    const documents = [
        ...generateDocumentationForApis({ apis }),
        ...generateDocumentationForWiki(),
        ...generateDocumentationForHome(),
    ];
    const assets = generateAssetsForApis({ apis });
    const registrations = generateRegistrations();
    const customFields = generateCustomFields();

    return {
        accountPlans,
        apiEulas,
        apiGroups,
        apis,
        applications,
        assets,
        customFields,
        documents,
        organizations,
        registrations,
        tags,
        userContexts,
    };
}

function generateAccountPlans() {
    return [
        {
            uuid: faker.random.uuid(),
            defaultPlan: false,
            description: faker.company.catchPhrase(),
            name: faker.company.companyName(),
            organizationUsage: '0',
            quota: 100,
            quotaInterval: 'DAY',
            rateLimit: 100,
        },
    ];
}

function generateOrganizations({ accountPlans }) {
    return Array.from(Array(5).keys()).map(() => ({
        uuid: faker.random.uuid(),
        accountPlanUuid: faker.random.arrayElement(accountPlans),
        tenantId: 'apim',
        name: faker.company.companyName(),
        description: faker.company.catchPhrase(),
        status: faker.random.arrayElement(['ENABLED']),
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
                    orgPublisher: false,
                    orgAdmin: false,
                    apiOwner: false,
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
                    orgAdmin: false,
                    apiOwner: true,
                },
            },
        ],
    });

    const orgAdmin = generateUserContext({
        organizations,
        userContexts: [
            {
                userDetails: {
                    username: 'orgAdmin',
                    orgPublisher: false,
                    orgAdmin: true,
                    apiOwner: false,
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
                    developer: true,
                },
            },
        ],
    });

    return [portalAdmin, orgPublisher, orgAdmin, apiOwner, user];
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
                        developer: false,
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

function generateApiEulas() {
    return [
        {
            Uuid: 'c9406345-eb76-11e3-b0cd-000nosaj86a8',
            Name: 'Standard EULA',
            ApiUsage: '2',
            ApplicationUsage: '2',
            Content:
                '<span>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do\n  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad\n  minim veniam, quis nostrud exercitation ullamco laboris nisi ut\n  aliquip ex ea commodo consequat. Duis aute irure dolor in\n  reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla\n  pariatur. Excepteur sint occaecat cupidatat non proident, sunt in\n  culpa qui officia deserunt mollit anim id est laborum.</span>',
            PossibleActions: {
                results: ['DELETE', 'EDIT'],
            },
        },
    ];
}

function generateApis(data) {
    return Array.from(Array(25).keys()).map(() => generateApi(data));
}

function generateApi({ tags, apiGroups, apiEulas, ...data }) {
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
            apiEulaUuid: faker.random.arrayElement(apiEulas).Uuid,
        },
        data
    );
}

function generateApiGroups(data) {
    return Array.from(Array(4).keys()).map(() => generateApiGroup(data));
}

function generateApiGroup({ apis, ...data }) {
    const uuid = faker.random.uuid();

    return merge(
        {
            id: uuid,
            uuid,
            name: faker.fake('{{commerce.product}}'),
            description: faker.fake(
                '{{commerce.productName}} {{commerce.productAdjective}} {{commerce.productMaterial}}'
            ),
            apis: faker.random
                .arrayElements(apis, faker.random.number({ min: 1, max: 5 }))
                .map(({ uuid, name, status }) => ({ uuid, name, status })),
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
    const status = faker.random.arrayElement([
        'ENABLED',
        'ENABLED',
        'ENABLED',
        'ENABLED',
        'DISABLED',
        'DISABLED',
        'DEPRECATED',
        'UNPUBLISHED',
        'REJECTED',
        'APPLICATION_PENDING_APPROVAL',
        'EDIT_APPLICATION_PENDING_APPROVAL',
    ]);
    const generateDisabledByType = status =>
        [
            'APPLICATION_PENDING_APPROVAL',
            'EDIT_APPLICATION_PENDING_APPROVAL',
        ].includes(status)
            ? faker.random.arrayElement(['INTERNAL', 'EXTERNAL'])
            : null;
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
            status,
            disabledByType: generateDisabledByType(status),
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

function generateAssetsForApis({ apis, ...data }) {
    const assets = apis.reduce((acc, api) => {
        acc.push(...generateAssetsForApi({ api }));
        return acc;
    }, []);
    return assets;
}

// Rules for the typeUuid:
// - for API and APPLICATION its the uuid of the application or api the docs are attached to
// - for HOME or CUSTOM it can be any unique value (unique to the tenant)

function generateDocumentationForApi({ api, ...data }) {
    const nbRootDocuments = faker.random.number({ min: 0, max: 6 });
    let documents = [];

    for (let index = 0; index < nbRootDocuments; index++) {
        documents.push(
            ...generateDocumentsForLocales({
                type: 'api',
                typeUuid: api.uuid,
                ordinal: index,
                maxChild: 3,
            })
        );
    }

    return documents;
}

function generateDocumentationForWiki() {
    const nbRootDocuments = 4;

    let documents = [];
    for (let index = 0; index < nbRootDocuments; index++) {
        documents.push(
            ...generateDocumentsForLocales({
                type: 'custom',
                typeUuid: 'wiki1',
                ordinal: index,
                maxChild: 2,
            })
        );
    }
    return documents;
}

function generateDocumentationForHome() {
    let documents = generateDocumentsForLocales({
        type: 'home',
        typeUuid: 'home1',
        ordinal: 0,
        maxChild: 0,
    });
    documents[0].navtitle = 'home1';
    return documents;
}

function generateDocumentsForLocales(params) {
    return ['en-US', 'fr-FR'].reduce((documents, locale) => {
        documents.push(...generateDocuments({ locale, ...params }));
        return documents;
    }, []);
}

function generateDocuments({ locale, maxChild, ordinal, ...data }) {
    const documents = [];

    const title = `${locale} - ${faker.company.catchPhrase()}`;
    const document = generateDocument({
        title,
        locale,
        ordinal,
        ...data,
    });

    documents.push(document);

    const nbChildDocuments = faker.random.number({ min: 0, max: maxChild });
    for (let index = 0; index < nbChildDocuments; index++) {
        documents.push(
            ...generateDocuments({
                locale,
                maxChild: maxChild - 2,
                parentUuid: document.uuid,
                ...data,
                ordinal: index,
            })
        );
    }

    return documents;
}

function generateDocument({ title, ...data }) {
    return {
        uuid: faker.random.uuid(),
        status: 'PUBLISHED',
        title,
        navtitle: faker.helpers.slugify(title).toLowerCase(),
        markdown: faker.lorem.text(faker.random.number({ min: 1, max: 10 })),
        ...data,
    };
}

function generateRegistrations() {
    return [];
}

function generateCustomFields() {
    return [
        {
            Name: 'custom-text-field-disabled',
            Uuid: '64e9c94f-c724-4749-9470-db096a3788d4',
            Status: 'DISABLED',
            Required: true,
            Description: 'A disabled custom text field',
            Type: 'TEXT',
            EntityType: 'APPLICATION',
        },
        {
            Name: 'custom-text-field-api',
            Uuid: 'c0b3ff30-6c7a-4d4c-84af-56e8dc3c06bc',
            Status: 'ENABLED',
            Required: true,
            Description: 'A custom text field for APIs',
            Type: 'TEXT',
            EntityType: 'API',
        },
        {
            Name: 'custom-text-field',
            Uuid: '0e93c523-ca24-46e4-bd0d-20fd361e205c',
            Status: 'ENABLED',
            Required: true,
            Description: 'A custom text field',
            Type: 'TEXT',
            EntityType: 'APPLICATION',
        },
        {
            Name: 'custom-select-field',
            Uuid: 'bb683549-ddf4-4aad-9761-1e5cad981672',
            Status: 'ENABLED',
            Required: true,
            Description: 'A custom select field',
            Type: 'SINGLE_SELECT',
            EntityType: 'APPLICATION',
            OptionsList: {
                results: [
                    {
                        Value: 'Choice 2',
                        Ordinal: 1,
                    },
                    {
                        Value: 'Choice 1',
                        Ordinal: 0,
                    },
                    {
                        Value: 'Choice 3',
                        Ordinal: 2,
                    },
                ],
            },
        },
    ];
}

module.exports = {
    generateData,
    generateOrganizations,
    generateUserContexts,
    generateUserContext,
    generateApis,
    generateApiGroups,
    generateApplications,
    generateRegistrations,
};
