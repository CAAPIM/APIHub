import React from 'react';
import { useGetOne, useTranslate, CRUD_GET_ONE } from 'ra-core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

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

    const { data, loaded, loading, error } = useGetOne(
        'documents',
        document.id,
        { action: CRUD_GET_ONE }
    );

    if (loading) {
        return <LinearProgress />;
    }

    if (loaded && !!(!data || error)) {
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
