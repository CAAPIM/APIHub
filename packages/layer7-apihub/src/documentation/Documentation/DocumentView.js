import React from 'react';
import { useTranslate, useGetOne, CRUD_GET_ONE } from 'react-admin';
import get from 'lodash/get';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { buildDocumentId } from '../../dataProvider/documents';
import { MarkdownView } from '../../ui';
import { DocumentToolbar } from './DocumentToolbar';

export const DocumentView = ({
    document,
    entityType,
    entityUuid,
    userCanEdit,
    userCanDelete,
    hasChildren,
    onEdit,
    onAddNewDocument,
    onDeleteDocument,
}) => {
    const translate = useTranslate();
    const classes = useStyles();

    const documentId = buildDocumentId(
        entityType,
        entityUuid,
        document.navtitle,
        document.locale
    );

    const { data, loaded, loading, error } = useGetOne(
        'documents',
        documentId,
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
                onEdit={onEdit}
                onAddNewDocument={onAddNewDocument}
                onDeleteDocument={onDeleteDocument}
            />
            <MarkdownView
                className={classes.markdown}
                value={get(data, 'markdown', '')}
            />
        </>
    );
};

const useStyles = makeStyles(
    theme => ({
        markdown: {
            padding: theme.spacing(2),
        },
    }),
    {
        name: 'Layer7DocumentView',
    }
);
