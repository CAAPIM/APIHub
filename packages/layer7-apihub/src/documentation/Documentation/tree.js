// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import get from 'lodash/get';

/**
 * Compare two documents by ordinal respecting the ascending order (smallest to biggest).
 * @param {Array} documentA The first document
 * @param {Array} documentB The second document
 */
export const sortByOrdinal = (documentA, documentB) =>
    documentA.ordinal - documentB.ordinal;

/**
 * Compare two documents by ordinal respecting the descending order (biggest to smallest).
 * @param {Array} documentA The first document
 * @param {Array} documentB The second document
 */
export const sortByOrdinalDesc = (documentA, documentB) =>
    documentB.ordinal - documentA.ordinal;

/**
 * Get the first document from an array of documents.
 * The first document is the root document with the smallest ordinal.
 * @param {Array} documents An array of all documents
 */
export const getFirstDocument = documents => {
    if (!Array.isArray(documents) || documents.length === 0) {
        return null;
    }
    return documents
        .filter(document => !document.parentUuid)
        .sort(sortByOrdinal)[0];
};

/**
 * Builds a tree from an array of documents
 * @param {Array} documents An array of documents
 * @param {Function} sortFn The sort function to use
 */
export const getDocumentationTree = (documents, sortFn = a => a) => {
    return documents
        .filter(document => !document.parentUuid)
        .reduce((acc, document) => {
            document.children = getChildDocuments(document, documents, sortFn);
            acc.push(document);
            return acc;
        }, [])
        .sort(sortFn);
};

/**
 * Get all the children of a document
 * @param {Object} parent A document
 * @param {Array} documents An array of all documents
 * @param {Function} sortFn The sort function to use
 */
export const getChildDocuments = (parent, documents, sortFn = a => a) => {
    return documents
        .filter(
            document => document.parentUuid === parent.uuid && !!parent.uuid
        )
        .reduce((acc, document) => {
            document.children = getChildDocuments(document, documents, sortFn);
            acc.push(document);
            return acc;
        }, [])
        .sort(sortFn);
};

export const getSiblingsDocuments = (tree = [], parentUuid = undefined) => {
    if (parentUuid === undefined) {
        return tree;
    }

    let index = 0;

    while (index < tree.length) {
        const document = tree[index];

        const children = get(document, 'children', []);

        if (document.uuid === parentUuid) {
            return children;
        }

        const result = getSiblingsDocuments(children, parentUuid);

        if (result.length > 0) {
            return result;
        }

        index++;
    }

    return [];
};

export const documentHasChildren = (documents, document) => {
    return documents.some(node => node.parentUuid === document.uuid);
};

/**
 * Verify that node specified by `parentUuid` nor any of its parents is the node specified by `nodeUuid`.
 *
 * @param {Array} documents An array of all nodes in the tree
 * @param {String} parentUuid The uuid of the first node to check
 * @param {String} nodeUuid The uuid of the node for which we are looking up parents
 */
export const hasParentWithId = (documents, parentUuid, nodeUuid) => {
    if (parentUuid === nodeUuid) {
        return true;
    }

    const currentNode = documents.find(item => item.uuid === parentUuid);
    if (!currentNode || !currentNode.parentUuid) {
        return false;
    }

    return hasParentWithId(documents, currentNode.parentUuid, nodeUuid);
};

export const getMaxOrdinalFromDocuments = documents => {
    if (!Array.isArray(documents) || documents.length === 0) {
        return -1;
    }
    const sortedSiblings = documents.sort(sortByOrdinalDesc);

    return sortedSiblings[0].ordinal;
};

export const getParentDocument = (documents, parentUuid) =>
    documents.find(item => item.uuid === parentUuid);

export function getAllDocumentParents(document, documents) {
    const getParent = document =>
        documents.find(item => item.uuid === document.parentUuid);

    let currentDocument = document;
    const parents = [];

    while (currentDocument && currentDocument.parentUuid) {
        const parent = getParent(currentDocument);
        if (parent) {
            parents.push(parent);
        }
        currentDocument = parent;
    }

    return parents;
}

/**
 * Builds a flat array of documents from a tree
 * @param {Object} tree A tree of document items
 */
export const getArrayFromTree = tree => {
    return tree.reduce((acc, item) => {
        return [].concat(
            acc,
            item.children ? getArrayFromTree(item.children) : []
        );
    }, tree);
};

/**
 * Builds a tree from an array of documents but add intermediate items
 * used as drop targets for reordering before and/or after each node.
 * @param {Array} documents An array of documents
 * @param {String} draggedDocumentId The id of the document being dragged
 * @param {Function} sortFn The sort function to use
 */
export const getDocumentationTreeForDragDrop = (
    documents,
    draggedDocumentId,
    sortFn = sortByOrdinal
) => {
    const tree = getDocumentationTree(documents, sortFn);
    const draggedDocument = documents.find(
        document => document.id === draggedDocumentId
    );

    const result = tree.reduce(
        (acc, document) =>
            acc.concat(addDropTargets(document, draggedDocument)),
        []
    );
    return result;
};

const addDropTargets = ({ children, ...document }, draggedDocument) => {
    if (document.id === draggedDocument.id) {
        return [document];
    }

    const targets = [
        {
            ...document,
            children: children.reduce(
                (acc, childDocument) =>
                    acc.concat(addDropTargets(childDocument, draggedDocument)),
                []
            ),
            dropData: {
                ordinal: children.length,
                parentUuid: document.uuid,
            },
        },
    ];

    // Allow dropping at the very first position
    if (document.ordinal === 0) {
        targets.unshift({
            id: `before|${document.id}`,
            parentUuid: document.parentUuid,
            ordinal: 0,
            title: 'apihub.actions.tree_drop_before',
            relatedNode: document,
            dropTarget: true,
            dropData: {
                ordinal: 0,
                parentUuid: document.parentUuid,
            },
        });
    }

    // It does not make sense to allow dropping after the previous node
    const isPreviousNode =
        document.ordinal === draggedDocument.ordinal - 1 &&
        document.parentUuid === draggedDocument.parentUuid;
    if (!isPreviousNode) {
        targets.push({
            id: `after|${document.id}`,
            parentUuid: document.parentUuid,
            ordinal: document.ordinal + 1,
            title: 'apihub.actions.tree_drop_after',
            relatedNode: document,
            dropTarget: true,
            dropData: {
                ordinal: document.ordinal + 1,
                parentUuid: document.parentUuid,
            },
        });
    }

    return targets;
};
