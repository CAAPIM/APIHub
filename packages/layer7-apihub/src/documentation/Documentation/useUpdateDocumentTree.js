// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { useCallback, useEffect } from 'react';

import { useLayer7Notify } from '../../useLayer7Notify';
import { useMutation } from '@tanstack/react-query';
import { useDataProvider } from 'react-admin';

export const moveDocument = ({
    documentUuid,
    newParentUuid,
    ordinal: newOrdinal,
    allDocuments,
}) => {
    const updatedDocument = allDocuments.find(doc => doc.uuid === documentUuid);

    if (!updatedDocument) {
        return;
    }

    const oldOrdinal = updatedDocument.ordinal;
    const oldParentUuid = updatedDocument.parentUuid;

    const result = allDocuments.map((doc, index) => {
        if (doc.uuid === updatedDocument.uuid) {
            const newSiblings =
                allDocuments.find(doc => doc.parentUuid === newParentUuid) ||
                [];

            const siblingsCount =
                oldParentUuid !== newParentUuid
                    ? newSiblings.length + 1
                    : newSiblings.length;

            const finalOrdinal =
                newOrdinal > siblingsCount - 1 ? siblingsCount - 1 : newOrdinal;

            return {
                ...doc,
                parentUuid: newParentUuid,
                ordinal: finalOrdinal < 0 ? 0 : finalOrdinal,
            };
        }
        if (
            oldParentUuid === newParentUuid &&
            doc.parentUuid === oldParentUuid
        ) {
            if (oldOrdinal < newOrdinal) {
                if (doc.ordinal > oldOrdinal && doc.ordinal <= newOrdinal) {
                    return {
                        ...doc,
                        ordinal: doc.ordinal - 1,
                    };
                }
            }

            if (oldOrdinal > newOrdinal) {
                if (doc.ordinal < oldOrdinal && doc.ordinal >= newOrdinal) {
                    return {
                        ...doc,
                        ordinal: doc.ordinal + 1,
                    };
                }
            }
        }
        if (oldParentUuid !== newParentUuid) {
            if (doc.parentUuid === oldParentUuid && doc.ordinal >= oldOrdinal) {
                return {
                    ...doc,
                    ordinal: doc.ordinal - 1,
                };
            }

            if (doc.parentUuid === newParentUuid && doc.ordinal >= newOrdinal) {
                return {
                    ...doc,
                    ordinal: doc.ordinal + 1,
                };
            }
        }

        return doc;
    });

    return result;
};

const prepareDataForUpdate = items =>
    items.map(({ id, children, markdown, ...item }) => item);

export const useUpdateDocumentTree = ({
    entityType,
    entityUuid,
    items,
    locale,
}) => {
    const dataProvider = useDataProvider();
    const notify = useLayer7Notify();
    const { mutate, data, isLoading, isError, error, isSuccess } = useMutation({
        mutationFn: vars => dataProvider.updateTree('documents', vars),
    });

    useEffect(() => {
        if (isSuccess) {
            notify(
                'resources.documents.notifications.tree_updated_success',
                'info',
                undefined,
                true
            );
        }
    }, [isSuccess, notify]);

    useEffect(() => {
        if (isError) {
            notify(
                error || 'resources.documents.notifications.tree_updated_error',
                'error'
            );
        }
    }, [error, isError, notify]);

    const handleSave = useCallback(
        ({ documentUuid, newParentUuid, ordinal }) => {
            const newDocuments = moveDocument({
                documentUuid,
                newParentUuid,
                ordinal,
                allDocuments: items,
            });

            mutate({
                entityType,
                entityUuid,
                locale,
                data: prepareDataForUpdate(newDocuments),
            });
            // {
            //     undoable: true,
            //     onSuccess: () => {
            // Fake a getList fetch success to optimistically update
            // the treeview, avoiding a full view refresh
            // dispatch({
            //     type: CRUD_GET_LIST_SUCCESS,
            //     payload: {
            //         data: newDocuments,
            //         total: newDocuments.length,
            //     },
            //     meta: {
            //         resource: 'documents',
            //         fetchResponse: GET_LIST,
            //         fetchStatus: FETCH_END,
            //     },
            // });
            // },
            // Fake a getList fetch success to optimistically update
            // the treeview, avoiding a full view refresh
            // Here we pass the original documents
            // dispatch({
            //     type: CRUD_GET_LIST_SUCCESS,
            //     payload: {
            //         data: items,
            //         total: items.length,
            //     },
            //     meta: {
            //         resource: 'documents',
            //         fetchResponse: GET_LIST,
            //         fetchStatus: FETCH_END,
            //     },
            // });
            // },
            // }
            // );
        },
        [entityType, entityUuid, items, locale, mutate, notify]
    );

    return [handleSave, isLoading, isError, data];
};
