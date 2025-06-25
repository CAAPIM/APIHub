// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import Button from '@mui/material/Button';
import { useDelete, useTranslate, useRefresh } from 'react-admin';

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

    const [deleteOne] = useDelete();

    const handleDeleteDocument = () => {
        const shouldDelete = window.confirm(
            hasChildren
                ? translate(
                      'resources.documents.confirm_delete_document_with_children'
                  )
                : translate(
                      'resources.documents.confirm_delete_document_without_children'
                  )
        );
        if (shouldDelete) {
            deleteOne(
                'documents',
                { id: document.id },
                {
                    onSuccess: () => {
                        notify(
                            'resources.documents.notifications.delete_success',
                            'info',
                            {
                                smart_count: 1,
                            }
                        );
                        refresh();
                        onClick();
                    },
                    onError: error => {
                        notify(
                            error ||
                                'resources.documents.notifications.delete_error',
                            'error'
                        );
                    },
                }
            );
        }
    };

    return <Button onClick={handleDeleteDocument} {...rest} />;
};
