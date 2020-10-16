export const ENTITY_TYPE_API = 'api';
export const ENTITY_TYPE_APPLICATION = 'application';
export const ENTITY_TYPE_HOME = 'home';
export const ENTITY_TYPE_CUSTOM = 'custom';

export const buildDocumentId = (entityType, entityUuid, navtitle, locale) => {
    // The document API does not follow the usual REST convention
    // To make it work with react admin, we build an ID which will be destructured
    // in the dataProvider
    return `${entityType}/${entityUuid}/${navtitle}/${locale}`;
};

/**
 * Prepare data to create a document
 * Filtered params are: id, uuid, children
 * Conserved params are: type, typeUuid, locale, parentUuid, status, title, navtitle, markdown, ordinal, modifyTs
 */
const prepareCreateData = ({ id, uuid, children, ...rest }) =>
    JSON.stringify(rest);

/**
 * Prepare data to update a document
 * Filtered params are: id, children
 * Conserved params are: uuid, type, typeUuid, locale, parentUuid, status, title, navtitle, markdown, ordinal, modifyTs
 */
const prepareUpdateData = ({ id, children, ...rest }) => JSON.stringify(rest);

export const documentsDataProvider = context => {
    const basePath = `${context.apiUrl}/document-service/1.0`;

    return {
        getList: async ({ filter }) => {
            const { entityType, entityUuid, locale } = filter;

            const url = `${basePath}/docs/${entityType}/${entityUuid}?locale=${locale}`;

            const { json } = await context.fetchJson(url, {
                credentials: 'include',
            });

            return {
                data: json.map(item => ({
                    ...item,
                    id: buildDocumentId(
                        entityType,
                        entityUuid,
                        item.navtitle,
                        locale
                    ),
                })),
                total: json.length,
            };
        },
        getOne: async ({ id }) => {
            const [entityType, entityUuid, navtitle, locale] = id.split('/');
            const url = `${basePath}/docs/${entityType}/${entityUuid}/${encodeURIComponent(
                navtitle
            )}?locale=${locale}`;

            const { json } = await context.fetchJson(url, {
                credentials: 'include',
            });

            return {
                data: {
                    ...json,
                    id: buildDocumentId(
                        entityType,
                        entityUuid,
                        json.navtitle,
                        json.locale
                    ),
                },
            };
        },
        create: async ({ data: { id, ...body } }) => {
            const [entityType, entityUuid] = id.split('/');
            const { navtitle } = body;
            const url = `${basePath}/docs/${entityType}/${entityUuid}/${navtitle}`;

            const { json } = await context.fetchJson(url, {
                credentials: 'include',
                method: 'POST',
                body: prepareCreateData(body),
            });

            return {
                data: {
                    ...json,
                    id: buildDocumentId(
                        entityType,
                        entityUuid,
                        json.navtitle,
                        json.locale
                    ),
                },
            };
        },
        update: async ({ data: { id, ...body } }) => {
            const [entityType, entityUuid, navtitle, locale] = id.split('/');
            const url = `${basePath}/docs/${entityType}/${entityUuid}/${encodeURIComponent(
                navtitle
            )}?locale=${locale}`;

            const { json } = await context.fetchJson(url, {
                credentials: 'include',
                method: 'PUT',
                body: prepareUpdateData(body),
            });

            return {
                data: {
                    ...json,
                    id: buildDocumentId(
                        entityType,
                        entityUuid,
                        json.navtitle,
                        json.locale
                    ),
                },
            };
        },
        updateTree: async ({ entityType, entityUuid, locale, data }) => {
            const url = `${basePath}/docs/${entityType}/${entityUuid}?locale=${locale}`;

            const { json } = await context.fetchJson(url, {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify(data),
            });

            return { data: json };
        },
        delete: async ({ id }) => {
            const [entityType, entityUuid, navtitle, locale] = id.split('/');
            const url = `${basePath}/docs/${entityType}/${entityUuid}/${encodeURIComponent(
                navtitle
            )}?locale=${locale}&forceDelete=true`;

            const {
                json: { ...data },
            } = await context.fetchJson(url, {
                credentials: 'include',
                method: 'DELETE',
            });

            return {
                data: {
                    ...data,
                    id: buildDocumentId(
                        entityType,
                        entityUuid,
                        data.navtitle,
                        data.locale
                    ),
                },
            };
        },
    };
};
