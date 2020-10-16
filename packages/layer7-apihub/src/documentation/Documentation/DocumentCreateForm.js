import React, { useMemo } from 'react';
import {
    SimpleForm,
    FormDataConsumer,
    TextInput,
    useCreate,
    useRefresh,
    required,
    CRUD_CREATE,
} from 'react-admin';
import { makeStyles } from '@material-ui/core';
import { useForm } from 'react-final-form';
import slugify from 'slugify';

import { useLayer7Notify } from '../../useLayer7Notify';
import { buildDocumentId } from '../../dataProvider/documents';
import { MarkdownInput } from '../../ui';
import { DocumentFormToolbar } from './DocumentFormToolbar';

export const DocumentCreateForm = ({
    document,
    entityType,
    entityUuid,
    allDocuments = [],
    onSaved = () => {},
    onCancel = () => {},
}) => {
    const notify = useLayer7Notify();
    const refresh = useRefresh();

    const [create, { loading, error }] = useCreate('documents');

    const handleSave = newDocument => {
        const documentId = buildDocumentId(
            entityType,
            entityUuid,
            newDocument.navtitle,
            newDocument.locale
        );

        create(
            {
                payload: { data: { ...newDocument, id: documentId } },
            },
            {
                action: CRUD_CREATE,
                onSuccess: ({ data }) => {
                    notify('resources.documents.notifications.create_success');
                    refresh();
                    onSaved(data);
                },
                onFailure: error => {
                    notify(
                        error ||
                            'resources.documents.notifications.create_error',
                        'error'
                    );
                },
            }
        );
    };

    return (
        <DocumentForm
            document={document}
            loading={loading}
            error={error}
            allDocuments={allDocuments}
            onSave={handleSave}
            onCancel={onCancel}
        />
    );
};

export const DocumentForm = ({
    document = {},
    loading = false,
    error = null,
    allDocuments = [],
    onSave = () => {},
    onCancel = () => {},
    ...rest
}) => {
    const classes = useStyles(rest);

    const navtitles = useMemo(
        () => Object.values(allDocuments).map(item => item.navtitle),
        [allDocuments]
    );

    return (
        <SimpleForm
            resource="documents"
            record={document}
            toolbar={
                <DocumentFormToolbar
                    loading={loading}
                    error={error}
                    onCancel={onCancel}
                />
            }
            save={onSave}
        >
            <FormDataConsumer>
                {() => {
                    // eslint-disable-next-line
                    const form = useForm();
                    return (
                        <>
                            <TextInput
                                resource="documents"
                                source="title"
                                className={classes.title}
                                onChange={event => {
                                    const navtitleFieldState = form.getFieldState(
                                        'navtitle'
                                    );

                                    if (
                                        navtitleFieldState.modified &&
                                        navtitleFieldState.touched
                                    ) {
                                        return;
                                    }

                                    const newNavtitle = slugifyURI(
                                        event.target.value
                                    );

                                    form.change('navtitle', newNavtitle);
                                }}
                                validate={required()}
                            />
                            <TextInput
                                resource="documents"
                                source="navtitle"
                                className={classes.navtitle}
                                validate={[
                                    required(),
                                    checkUnicity(navtitles),
                                    checkSpecialCharacters(),
                                ]}
                            />
                        </>
                    );
                }}
            </FormDataConsumer>
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

const useStyles = makeStyles(
    theme => ({
        title: {
            display: 'inline-block',
            width: '256px',
        },
        navtitle: {
            display: 'inline-block',
            marginLeft: theme.spacing(4),
            width: '256px',
        },
        markdown: {
            width: '100%',
        },
    }),
    {
        name: 'Layer7DocumentCreateForm',
    }
);

const URI_ALLOWED_STRING = /^[a-zA-Z0-9_-]*$/;
const URI_NOT_ALLOWED_CHARACTERS = /[^a-zA-Z0-9_-\s]/g;

export const checkSpecialCharacters = () => value => {
    if (URI_ALLOWED_STRING.test(value)) {
        return;
    }
    return 'resources.documents.validation.error_no_special_characters';
};

export const checkUnicity = navtitles => value => {
    if (
        !navtitles
            .map(navtitle => navtitle.toLowerCase())
            .includes(value.toLowerCase())
    ) {
        return;
    }
    return 'resources.documents.validation.error_navtitle_not_unique';
};

const replaceNotAllowedCharacters = (text, replacement = '_') => {
    return text.replace(URI_NOT_ALLOWED_CHARACTERS, replacement);
};

export const slugifyURI = uri => {
    const cleanedURI = replaceNotAllowedCharacters(uri, '_');
    return slugify(cleanedURI);
};
