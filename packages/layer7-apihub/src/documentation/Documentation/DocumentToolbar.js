import React from 'react';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconEdit from '@material-ui/icons/Edit';
import IconDelete from '@material-ui/icons/Delete';
import IconAdd from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslate } from 'ra-core';

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
    const classes = useStyles();
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
                        color="primary"
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

const useStyles = makeStyles(
    theme => ({
        root: {
            padding: theme.spacing(1),
        },
        button: {
            '& + &': {
                marginLeft: theme.spacing(2),
            },
        },
    }),
    {
        name: 'Layer7DocumentationToolbar',
    }
);
