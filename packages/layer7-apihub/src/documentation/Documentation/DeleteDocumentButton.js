import React from 'react';
import Button from '@material-ui/core/Button';
import { CRUD_DELETE, useDelete, useTranslate, useRefresh } from 'ra-core';

import { useLayer7Notify } from '../../useLayer7Notify';

export const DeleteDocumentButton = ({
    document,
    entityType,
    entityUuid,
    hasChildren,
    onClick,
    ...rest
}) => {
    const translate = useTranslate();
    const notify = useLayer7Notify();
    const refresh = useRefresh();

    const [deleteDocument] = useDelete('documents', document.id, document, {
        action: CRUD_DELETE,
        onSuccess: () => {
            notify('resources.documents.notifications.delete_success', 'info', {
                smart_count: 1,
            });
            refresh();
            onClick();
        },
        onFailure: error => {
            notify(
                error || 'resources.documents.notifications.delete_error',
                'error'
            );
        },
    });

    const handleDeleteDocument = () => {
        const shouldDelete = global.window.confirm(
            hasChildren
                ? translate(
                      'resources.documents.confirm_delete_document_with_children'
                  )
                : translate(
                      'resources.documents.confirm_delete_document_without_children'
                  )
        );
        if (shouldDelete) {
            deleteDocument();
        }
    };

    return <Button onClick={handleDeleteDocument} {...rest} />;
};
