// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useMemo } from 'react';
import {
    SimpleForm,
    FormDataConsumer,
    TextInput,
    useCreate,
    useRefresh,
    required,
} from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import { useFormContext } from 'react-hook-form';
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

    const [create, { isLoading, error }] = useCreate();

    const handleSave = newDocument => {
        const documentId = buildDocumentId(
            entityType,
            entityUuid,
            newDocument.navtitle,
            newDocument.locale
        );

        create(
            'documents',
            {
                data: {
                    ...newDocument,
                    id: documentId,
                },
            },
            {
                onSuccess: ({ data }) => {
                    notify('resources.documents.notifications.create_success');
                    refresh();
                    onSaved(data);
                },
                onError: error => {
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
            isLoading={isLoading}
            error={error}
            allDocuments={allDocuments}
            onSave={handleSave}
            onCancel={onCancel}
        />
    );
};

export const DocumentForm = ({
    document = {},
    isLoading = false,
    error = null,
    allDocuments = [],
    onSave = () => {},
    onCancel = () => {},
    ...rest
}) => {
    const { classes } = useStyles(rest);

    const navtitles = useMemo(
        () => Object.values(allDocuments).map(item => item.navtitle),
        [allDocuments]
    );

    return (
        <SimpleForm
            sanitizeEmptyValues={true}
            resource="documents"
            record={document}
            toolbar={
                <DocumentFormToolbar
                    isLoading={isLoading}
                    error={error}
                    onCancel={onCancel}
                />
            }
            onSubmit={onSave}
        >
            <FormDataConsumer>
                {() => {
                    // eslint-disable-next-line
                    const { getFieldState, setValue} = useFormContext();
                    return (
                        <div className={classes.titleContainer}>
                            <TextInput
                                resource="documents"
                                source="title"
                                className={classes.title}
                                onChange={event => {
                                    const navtitleFieldState =
                                        getFieldState('navtitle');
                                    if (
                                        navtitleFieldState.isDirty &&
                                        navtitleFieldState.isTouched
                                    ) {
                                        return;
                                    }

                                    const newNavtitle = slugifyURI(
                                        event.target.value
                                    );

                                    setValue('navtitle', newNavtitle);
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
                        </div>
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

const useStyles = makeStyles({ name: 'Layer7DocumentCreateForm' })(theme => ({
    titleContainer: {
        flexDirection: 'row',
        display: 'flex',
    },
    title: {
        width: '256px',
        marginRight: '10px',
    },
    navtitle: {
        width: '256px',
    },
    markdown: {
        width: '100%',
    },
}));

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
