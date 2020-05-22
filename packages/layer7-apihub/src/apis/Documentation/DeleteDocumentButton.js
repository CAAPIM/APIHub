import React from 'react';
import Button from '@material-ui/core/Button';
import {
    CRUD_DELETE,
    useDelete,
    useNotify,
    useTranslate,
    useRefresh,
} from 'ra-core';

export const DeleteDocumentButton = ({
    document,
    entityType,
    entityUuid,
    hasChildren,
    onClick,
    ...rest
}) => {
    const translate = useTranslate();
    const notify = useNotify();
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
        onFailure: () => {
            notify('resources.documents.notifications.delete_error', 'warning');
        },
    });

    const handleDeleteDocument = () => {
        const shouldDelete = global.window.confirm(
            hasChildren
                ? translate(
                      'resources.apis.documentation.confirm_delete_document_with_children'
                  )
                : translate(
                      'resources.apis.documentation.confirm_delete_document_without_children'
                  )
        );
        if (shouldDelete) {
            deleteDocument();
        }
    };

    return <Button onClick={handleDeleteDocument} {...rest} />;
};
