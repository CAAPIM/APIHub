// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useTranslate, useGetOne } from 'react-admin';
import get from 'lodash/get';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'tss-react/mui';

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

    const { data, isLoading, isError } = useGetOne('documents', {
        id: documentId,
    });

    if (isLoading) {
        return <LinearProgress />;
    }

    if (!isLoading && !!(!data || isError)) {
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

const useStyles = makeStyles({ name: 'Layer7DocumentView' })(theme => ({
    markdown: {
        padding: theme.spacing(2),
        '& code': {
            whiteSpace: 'pre-wrap',
        },
        '& table': {
            fontSize: '14px',
            lineHeight: '1.7',
            maxWidth: '100%',
            overflow: 'auto',
            border: '1px solid #f6f6f6',
            borderCollapse: 'collapse',
            borderSpacing: 0,
            boxSizing: 'border-box',
        },
        '& table th': {
            textAlign: 'center',
            fontWeight: 700,
            border: '1px solid #efefef',
            padding: '10px 6px',
            backgroundColor: '#f5f7fa',
            wordBreak: 'break-word',
        },
        '& table td': {
            border: '1px solid #efefef',
            textAlign: 'left',
            padding: '10px 15px',
            wordBreak: 'break-word',
            minWidth: '60px',
        },
    },
}));
