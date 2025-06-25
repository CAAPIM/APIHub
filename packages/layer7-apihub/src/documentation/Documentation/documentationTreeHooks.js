// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import {
    useDocumentationTreeContext,
    useDocumentationTreeDispatcherContext,
    saveExpandedNodes,
} from './DocumentationTreeProvider';
import { get } from 'lodash';
import { useCallback } from 'react';

// !! must be used within a DocumentationTreeProvider
export const useExpandedNodes = (entityUuid, locale) => {
    const dispatch = useDocumentationTreeDispatcherContext();
    const documentationTree = useDocumentationTreeContext();
    const expandedNodes = get(documentationTree, `${entityUuid}.${locale}`, []);
    const setExpandedNodes = useCallback(
        expanded => dispatch(saveExpandedNodes(entityUuid, locale, expanded)),
        [dispatch, entityUuid, locale]
    );

    return [expandedNodes, setExpandedNodes];
};
