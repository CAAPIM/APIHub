// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useEffect } from 'react';
import {
    SimpleForm,
    DateField,
    TextField,
    TextInput,
    useUpdate,
    required,
    Labeled,
} from 'react-admin';
import { makeStyles } from 'tss-react/mui';

import { useLayer7Notify } from '../../useLayer7Notify';
import { MarkdownInput } from '../../ui';
import { DocumentFormToolbar } from './DocumentFormToolbar';

export const DocumentEditForm = ({
    document,
    onSave = () => {},
    onCancel = () => {},
}) => {
    const notify = useLayer7Notify();

    const [update, { data, isLoading, error }] = useUpdate();

    const handleSave = newDocument => {
        update(
            'documents',
            {
                id: document.id,
                data: {
                    ...newDocument,
                    id: document.id,
                },
            },
            {
                onSuccess: () => {
                    notify('resources.documents.notifications.edit_success');
                },
                onError: error => {
                    notify(
                        error || 'resources.documents.notifications.edit_error',
                        'error'
                    );
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
            isLoading={isLoading}
            error={error}
            onSave={handleSave}
            onCancel={onCancel}
        />
    );
};

const DocumentForm = ({
    record = {},
    isLoading = false,
    error = null,
    onSave = () => {},
    onCancel = () => {},
}) => {
    const { classes } = useStyles();

    return (
        <SimpleForm
            sanitizeEmptyValues={true}
            resource="documents"
            record={record}
            toolbar={
                <DocumentFormToolbar
                    isLoading={isLoading}
                    error={error}
                    onCancel={onCancel}
                />
            }
            onSubmit={onSave}
        >
            <TextInput
                source="title"
                formClassName={classes.title}
                validate={required()}
            />
            <Labeled>
                <TextField source="navtitle" formClassName={classes.navtitle} />
            </Labeled>
            <Labeled>
                <DateField source="modifyTs" formClassName={classes.modifyTs} />
            </Labeled>
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

const useStyles = makeStyles({ name: 'Layer7DocumentEditForm' })(theme => ({
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
