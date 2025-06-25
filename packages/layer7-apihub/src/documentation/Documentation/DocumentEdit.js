// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useGetOne, useTranslate } from 'react-admin';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

import { DocumentEditForm } from './DocumentEditForm';
import { DocumentToolbar } from './DocumentToolbar';

export const DocumentEdit = ({
    document,
    entityType,
    entityUuid,
    userCanDelete,
    userCanEdit,
    hasChildren,
    onAddNewDocument,
    onDeleteDocument,
    ...rest
}) => {
    const translate = useTranslate();

    const { data, isLoading, error } = useGetOne('documents', {
        id: document.id,
    });

    if (isLoading) {
        return <LinearProgress />;
    }

    if (!isLoading && !!(!data || error)) {
        return (
            <Typography variant="body2" color="error">
                {translate('ra.page.error')}
            </Typography>
        );
    }

    return (
        <>
            <DocumentToolbar
                document={document}
                entityType={entityType}
                entityUuid={entityUuid}
                userCanEdit={userCanEdit}
                userCanAdd={userCanEdit}
                userCanDelete={userCanDelete}
                hasChildren={hasChildren}
                onAddNewDocument={onAddNewDocument}
                onDeleteDocument={onDeleteDocument}
                disabled
            />
            <DocumentEditForm document={data} {...rest} />
        </>
    );
};
