import React from 'react';
import get from 'lodash/get';

import { DocumentCreateForm, slugifyURI } from './DocumentCreateForm';
import { getMaxOrdinalFromDocuments, getSiblingsDocuments } from './tree';

export const DocumentCreate = props => {
    return <DocumentCreateForm {...props} />;
};

export const createNewDocument = (
    title,
    parentDocument,
    allItems,
    entityType,
    entityUuid,
    locale
) => {
    const navtitle = slugifyURI(title);
    const parentUuid = get(parentDocument, 'uuid', undefined);
    const siblingsItems = getSiblingsDocuments(allItems, parentUuid);
    const ordinal = getMaxOrdinalFromDocuments(siblingsItems) + 1;

    return {
        id: 'new-document',
        type: get(parentDocument, 'type', entityType),
        typeUuid: get(parentDocument, 'typeUuid', entityUuid),
        status: 'PUBLISHED',
        ordinal,
        locale,
        ...(parentUuid != null && { parentUuid }),
        title,
        navtitle,
        markdown: '',
    };
};
