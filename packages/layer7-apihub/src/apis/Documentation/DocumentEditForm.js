import React, { useEffect } from 'react';
import {
    SimpleForm,
    DateField,
    TextField,
    TextInput,
    useUpdate,
    useNotify,
    required,
    CRUD_UPDATE,
} from 'react-admin';
import { makeStyles } from '@material-ui/core';

import { MarkdownInput } from '../../ui';
import { DocumentFormToolbar } from './DocumentFormToolbar';

const useStyles = makeStyles(theme => ({
    title: {
        display: 'inline-block',
        width: '30%',
    },
    navtitle: {
        display: 'inline-block',
        marginLeft: theme.spacing(4),
        width: '30%',
    },
    modifyTs: {
        display: 'inline-block',
        marginLeft: theme.spacing(4),
        width: '30%',
    },
    markdown: {
        width: '100%',
    },
}));

const DocumentForm = ({
    record = {},
    loading = false,
    error = null,
    onSave = () => {},
    onCancel = () => {},
}) => {
    const classes = useStyles();

    return (
        <SimpleForm
            resource="documents"
            record={record}
            toolbar={
                <DocumentFormToolbar
                    loading={loading}
                    error={error}
                    onCancel={onCancel}
                />
            }
            save={onSave}
        >
            <TextInput
                source="title"
                formClassName={classes.title}
                validate={required()}
            />
            <TextField source="navtitle" formClassName={classes.navtitle} />
            <DateField source="modifyTs" formClassName={classes.modifyTs} />
            <MarkdownInput
                source="markdown"
                formClassName={classes.markdown}
                validate={required()}
                isRequired
                fullWidth
            />
        </SimpleForm>
    );
};

export const DocumentEditForm = ({
    document,
    onSave = () => {},
    onCancel = () => {},
}) => {
    const notify = useNotify();

    const [update, { data, loading, error }] = useUpdate('documents');

    const handleSave = newDocument => {
        update(
            {
                payload: {
                    id: document.id,
                    data: { ...newDocument, id: document.id },
                },
            },
            {
                action: CRUD_UPDATE,
                onSuccess: () => {
                    notify('resources.documents.notifications.edit_success');
                },
                onFailure: () => {
                    notify('resources.documents.notifications.edit_error');
                },
            }
        );
    };

    useEffect(() => {
        if (data && data.uuid) {
            onSave(data);
        }
    }, [data, onSave]);

    return (
        <DocumentForm
            record={document}
            loading={loading}
            error={error}
            onSave={handleSave}
            onCancel={onCancel}
        />
    );
};
