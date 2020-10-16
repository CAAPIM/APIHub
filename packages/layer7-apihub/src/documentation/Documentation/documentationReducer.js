import get from 'lodash/get';
import set from 'lodash/set';
import { combineReducers } from 'redux';

export const SAVE_EXPANDED_NODES = '@layer7/SAVE_EXPANDED_NODES';
export const ADD_EXPANDED_NODES = '@layer7/ADD_EXPANDED_NODES';

export const DOCUMENT_ADDED = '@layer7/DOCUMENT_ADDED';

export const documentationTreeReducer = (
    previousState = {},
    { type, payload }
) => {
    if (!payload || !payload.entityUuid || !payload.locale) {
        return previousState;
    }

    switch (type) {
        case SAVE_EXPANDED_NODES: {
            const newState = { ...previousState };
            return set(
                newState,
                `${payload.entityUuid}[${payload.locale}]`,
                payload.expandedNodes
            );
        }
        case ADD_EXPANDED_NODES: {
            const newExpandedNodes = new Set(
                get(
                    previousState,
                    `${payload.entityUuid}[${payload.locale}]`,
                    []
                )
            );

            payload.nodeIds.forEach(id => newExpandedNodes.add(id));
            const newState = { ...previousState };

            return set(
                newState,
                `${payload.entityUuid}[${payload.locale}]`,
                Array.from(newExpandedNodes)
            );
        }
        default:
            return previousState;
    }
};

export const newDocument = (previousState = null, { type, payload }) => {
    switch (type) {
        case DOCUMENT_ADDED:
            return payload;

        default:
            return previousState;
    }
};

export const documentationReducer = {
    documentation: combineReducers({
        documentationTree: documentationTreeReducer,
        newDocument,
    }),
};

// Tree

export const saveExpandedNodes = (entityUuid, locale, expandedNodes) => ({
    type: SAVE_EXPANDED_NODES,
    payload: { entityUuid, locale, expandedNodes },
});

export const addExpandedNodes = (entityUuid, locale, nodeIds) => ({
    type: ADD_EXPANDED_NODES,
    payload: { entityUuid, locale, nodeIds },
});

export const selectExpandedNodes = (entityUuid, locale) => state =>
    get(state, `documentation.documentationTree.${entityUuid}.${locale}`, []);

// New Document

export const addNewDocument = document => ({
    type: DOCUMENT_ADDED,
    payload: document,
});

export const removeNewDocument = () => ({
    type: DOCUMENT_ADDED,
    payload: null,
});

export const getNewDocument = state => state.documentation.newDocument;
