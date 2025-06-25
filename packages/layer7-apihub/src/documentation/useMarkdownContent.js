// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import {
    useCreate,
    useGetOne,
    useLocale,
    useRefresh,
    useUpdate,
} from 'react-admin';

import { useLayer7Notify } from '../useLayer7Notify';
import { documentationLocales } from '../i18n';
import { buildDocumentId } from '../dataProvider/documents';

/**
 * This hook is responsible for fetching the markdown content used in such
 * places as the homepage and application details.
 * It returns the markdown directly.
 *
 * @param {object} options
 * @param {string} options.entityType The document type
 * @param {string} options.entityUuid The uuid of the content type to retrieve
 * @param {string} options.navtitle The navtitle of the document
 *
 * @example
 * import { useMarkdownContent, MarkdownView } from 'layer7-apihub';
 *
 * export const HomePageContent = () => {
 *     const markdown = useMarkdownContent();
 *     return <MarkdownView value={markdown} />;
 * }
 */
export const useMarkdownContent = ({ entityType, entityUuid, navtitle }) => {
    const locale = useLocale();
    const notify = useLayer7Notify();
    const refresh = useRefresh();
    const id = buildDocumentId(
        entityType,
        entityUuid,
        navtitle,
        documentationLocales[locale]
    );
    const { data, isLoading } = useGetOne('documents', { id });

    const [create] = useCreate();
    const [update] = useUpdate();

    const handleSave = markdown => {
        const options = {
            onSuccess: () => {
                notify(
                    'resources.documents.notifications.edit_success',
                    'info',
                    undefined,
                    !!data
                );

                if (!data) {
                    refresh();
                }
            },
            onError: error => {
                notify(
                    error || 'resources.documents.notifications.edit_error',
                    'error'
                );
            },
            mutationsMode: !!data ? 'undoable' : 'pessimistic',
        };

        if (!!data) {
            update(
                'documents',
                {
                    id,
                    data: {
                        ...data,
                        markdown,
                    },
                },
                options
            );
        } else {
            create(
                'documents',
                {
                    data: {
                        id,
                        locale: documentationLocales[locale],
                        markdown,
                        navtitle,
                        ordinal: 0,
                        status: 'PUBLISHED',
                        title: navtitle,
                        type: entityType,
                        typeUuid: entityUuid,
                    },
                },
                options
            );
        }
    };

    return [{ data, isLoading }, handleSave];
};
