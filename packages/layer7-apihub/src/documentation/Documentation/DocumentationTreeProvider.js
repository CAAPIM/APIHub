// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { createContext, useContext, useReducer } from 'react';
import { get, set } from 'lodash';

export const SAVE_EXPANDED_NODES = '@layer7/SAVE_EXPANDED_NODES';
export const ADD_EXPANDED_NODES = '@layer7/ADD_EXPANDED_NODES';

const DocumentationTreeContext = createContext(undefined);

export const useDocumentationTreeContext = () => {
    const context = useContext(DocumentationTreeContext);
    if (context === undefined) {
        throw new Error(
            'useDocumentationTreeContext must be used within a DocumentationTreeProvider'
        );
    }
    return context;
};

const DocumentationTreeDispatcherContext = createContext(undefined);

export const useDocumentationTreeDispatcherContext = () => {
    const context = useContext(DocumentationTreeDispatcherContext);
    if (context === undefined) {
        throw new Error(
            'useDocumentationTreeDispatcherContext must be used within a DocumentationTreeProvider'
        );
    }
    return context;
};

export const DocumentationTreeProvider = ({ children }) => {
    const [documentationTree, dispatch] = useReducer(
        documentationTreeReducer,
        initialState
    );
    return (
        <DocumentationTreeContext.Provider value={documentationTree}>
            <DocumentationTreeDispatcherContext.Provider value={dispatch}>
                {children}
            </DocumentationTreeDispatcherContext.Provider>
        </DocumentationTreeContext.Provider>
    );
};

const initialState = {};

const documentationTreeReducer = (previousState = {}, { type, payload }) => {
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

export const saveExpandedNodes = (entityUuid, locale, expandedNodes) => ({
    type: SAVE_EXPANDED_NODES,
    payload: { entityUuid, locale, expandedNodes },
});

export const addExpandedNodes = (entityUuid, locale, nodeIds) => ({
    type: ADD_EXPANDED_NODES,
    payload: { entityUuid, locale, nodeIds },
});
