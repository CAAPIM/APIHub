// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconEdit from '@mui/icons-material/Edit';
import IconDelete from '@mui/icons-material/Delete';
import IconAdd from '@mui/icons-material/Add';
import { makeStyles } from 'tss-react/mui';
import { useTranslate } from 'react-admin';
import { AddDocumentButton } from './AddDocumentButton';
import { DeleteDocumentButton } from './DeleteDocumentButton';

/**
 * The toolbar displayed at the top of the document view
 */
export const DocumentToolbar = ({
    disabled,
    document,
    entityType,
    entityUuid,
    hasChildren,
    userCanEdit,
    userCanAdd,
    userCanDelete,
    onEdit,
    onAddNewDocument,
    onDeleteDocument,
}) => {
    const { classes } = useStyles();
    const translate = useTranslate();

    if (!document || (!userCanEdit && !userCanDelete)) {
        return null;
    }

    return (
        <>
            <div className={classes.root}>
                {userCanAdd && (
                    <AddDocumentButton
                        document={document}
                        color="primary"
                        size="small"
                        onClick={onAddNewDocument}
                        disabled={disabled}
                        className={classes.button}
                        aria-label={translate(
                            'resources.documents.actions.new_child_document_button'
                        )}
                        startIcon={<IconAdd />}
                    >
                        {translate(
                            'resources.documents.actions.new_child_document_button'
                        )}
                    </AddDocumentButton>
                )}
                {userCanEdit && (
                    <Button
                        size="small"
                        onClick={onEdit}
                        disabled={disabled}
                        className={classes.button}
                        aria-label={translate(
                            'resources.documents.actions.edit_document_button'
                        )}
                        startIcon={<IconEdit />}
                    >
                        {translate(
                            'resources.documents.actions.edit_document_button'
                        )}
                    </Button>
                )}
                {userCanDelete && (
                    <DeleteDocumentButton
                        document={document}
                        entityType={entityType}
                        entityUuid={entityUuid}
                        hasChildren={hasChildren}
                        color="primary"
                        size="small"
                        onClick={onDeleteDocument}
                        disabled={disabled}
                        className={classes.button}
                        aria-label={translate(
                            'resources.documents.actions.delete_document_button'
                        )}
                        startIcon={<IconDelete />}
                    >
                        {translate(
                            'resources.documents.actions.delete_document_button'
                        )}
                    </DeleteDocumentButton>
                )}
            </div>
            <Divider />
        </>
    );
};

const useStyles = makeStyles({ name: 'Layer7DocumentationToolbar' })(
    theme => ({
        root: {
            padding: theme.spacing(1),
        },
        button: {
            '& + &': {
                marginLeft: theme.spacing(2),
            },
        },
    })
);
