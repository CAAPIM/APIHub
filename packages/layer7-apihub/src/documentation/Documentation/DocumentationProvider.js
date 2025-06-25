// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { createContext, useContext, useReducer } from 'react';

const DOCUMENT_ADDED = '@layer7/DOCUMENT_ADDED';

const DocumentationContext = createContext(undefined);

export const useDocumentationContext = () => {
    const context = useContext(DocumentationContext);
    if (context === undefined) {
        throw new Error(
            'useDocumentationContext must be used within a DocumentationProvider'
        );
    }
    return context;
};

const DocumentationDispatcherContext = createContext(undefined);

export const useDocumentationDispatcherContext = () => {
    const context = useContext(DocumentationDispatcherContext);
    if (context === undefined) {
        throw new Error(
            'useDocumentationDispatcherContext must be used within a DocumentationProvider'
        );
    }
    return context;
};

export const DocumentationProvider = ({ children }) => {
    const [newDocument, dispatch] = useReducer(
        newDocumentReducer,
        initialState
    );
    return (
        <DocumentationContext.Provider value={newDocument}>
            <DocumentationDispatcherContext.Provider value={dispatch}>
                {children}
            </DocumentationDispatcherContext.Provider>
        </DocumentationContext.Provider>
    );
};

const initialState = null;

const newDocumentReducer = (previousState, { type, payload }) => {
    switch (type) {
        case DOCUMENT_ADDED:
            return payload;

        default:
            return previousState;
    }
};

export const addNewDocument = document => ({
    type: DOCUMENT_ADDED,
    payload: document,
});

export const removeNewDocument = () => ({
    type: DOCUMENT_ADDED,
    payload: null,
});
