import React, { useMemo, useCallback, useEffect } from 'react';
import { CRUD_GET_LIST, useTranslate, useGetList, useVersion } from 'ra-core';
import { Labeled, NotFound } from 'react-admin';
import { useDispatch, useSelector } from 'react-redux';
import { parse, stringify } from 'query-string';
import { useHistory, useLocation } from 'react-router-dom';
import get from 'lodash/get';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import IconAdd from '@material-ui/icons/Add';

import { useApiHubPreference, readApiHubPreference } from '../../preferences';
import {
    DocumentationTree,
    DocumentView,
    DocumentCreate,
    DocumentEdit,
} from './';
import {
    getFirstDocument,
    documentHasChildren,
    getAllDocumentParents,
} from './tree';
import { createNewDocument } from './DocumentCreate';

import {
    defaultLocale,
    documentationLocales,
    LocaleSwitcherMenu,
    supportedLocales,
} from '../../i18n';
import {
    addNewDocument,
    removeNewDocument,
    getNewDocument,
    addExpandedNodes,
} from './documentationReducer';
import { useExpandedNodes } from './documentationTreeHooks';
import { useUpdateDocumentTree } from './useUpdateDocumentTree';

export const Documentation = ({ entityUuid, entityType, ...rest }) => {
    const translate = useTranslate();
    const version = useVersion();

    const [
        documentationLocalePreference,
        writeDocumentationLocalePreference,
    ] = useApiHubPreference('documentationLocale');

    useEffect(() => {
        const locale = readApiHubPreference('locale', defaultLocale);
        if (documentationLocalePreference === undefined) {
            writeDocumentationLocalePreference(locale);
        }
    }, [documentationLocalePreference, writeDocumentationLocalePreference]);

    const handleDocumentationLocaleChange = newLocale => {
        writeDocumentationLocalePreference(newLocale);
    };

    /**
     * We want the list of ids to be always available for optimistic rendering,
     * and therefore we need a custom action (CRUD_GET_LIST) that will be used.
     */
    const { ids, loaded, error, total } = useGetList(
        'documents',
        undefined,
        undefined,
        {
            entityType,
            entityUuid,
            locale: documentationLocales[documentationLocalePreference],
        },
        {
            action: CRUD_GET_LIST,
            version,
        }
    );

    // When the user changes the page/sort/filter or delete an item, this
    // controller runs the useGetList hook again. While the result of this new
    // call is loading, the ids and total are empty. To avoid rendering an
    // empty list at that moment, we override the ids and total with the latest
    // loaded ones.
    const defaultIds = useSelector(state =>
        get(state.admin.resources, ['documents', 'list', 'ids'], [])
    );

    const idsToDisplay = typeof total === 'undefined' ? defaultIds : ids;

    const data = useSelector(state =>
        get(state.admin.resources, ['documents', 'data'], {})
    );

    const items = useMemo(
        () =>
            Object.values(data)
                .filter(item => {
                    return (
                        item.locale ===
                        documentationLocales[documentationLocalePreference]
                    );
                })
                .filter(item => idsToDisplay.includes(item.id)),
        [data, documentationLocalePreference, idsToDisplay]
    );

    if (!loaded) {
        return <LinearProgress />;
    }

    if (!data || error) {
        return (
            <Typography variant="body2" color="error">
                {translate('ra.page.error')}
            </Typography>
        );
    }

    return (
        <DocumentationContent
            entityUuid={entityUuid}
            entityType={entityType}
            items={items}
            locale={documentationLocalePreference}
            onLocaleChange={handleDocumentationLocaleChange}
            {...rest}
        />
    );
};

const DocumentationContent = ({
    entityUuid,
    entityType,
    items,
    locale,
    onLocaleChange,
    userCanEdit = false,
    userCanDelete = false,
}) => {
    const translate = useTranslate();
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const [expanded, setExpanded] = useExpandedNodes(entityUuid, locale);
    const {
        error,
        mode,
        selectedDocument,
        selectedDocumentId,
        openDocumentPage,
        openNewDocumentPage,
        closeDocumentPage,
    } = useDocumentationHistory(items, entityUuid, locale);

    const [handleDocumentParentChange] = useUpdateDocumentTree({
        entityType,
        entityUuid,
        items,
        locale: documentationLocales[locale],
    });

    const handleLocaleChange = newLocale => {
        onLocaleChange(newLocale);
        closeDocumentPage();
    };

    const handleSelectDocument = document => {
        openDocumentPage(document, 'view');
    };

    const handleEditDocument = () => {
        openDocumentPage(selectedDocument, 'edit');
    };

    const handleSaveEditDocument = () => {
        openDocumentPage(selectedDocument, 'view');
    };

    const handleCancelEditDocument = () => {
        openDocumentPage(selectedDocument, 'view');
    };

    const newDocument = useSelector(getNewDocument);

    useEffect(() => {
        if (mode === 'add') {
            if (!history.location.state) {
                history.goBack();
                return;
            }
            dispatch(addNewDocument(history.location.state));
        } else if (newDocument) {
            dispatch(removeNewDocument());
        }
    }, [dispatch, history, mode, newDocument]);

    const handleAddNewDocument = parentDocument => {
        if (newDocument != null) {
            return;
        }

        if (parentDocument) {
            dispatch(addExpandedNodes(entityUuid, locale, [parentDocument.id]));
        }

        const title = translate('resources.documents.fields.new_document');

        openNewDocumentPage(
            createNewDocument(
                title,
                parentDocument,
                items,
                entityType,
                entityUuid,
                documentationLocales[locale]
            )
        );
    };

    const handleSaveNewDocument = document => {
        openDocumentPage(document, 'view');
    };

    const handleCancelAddNewDocument = () => {
        closeDocumentPage();
    };

    const handleDeleteDocument = () => {
        closeDocumentPage();
    };

    const hasChildren = useMemo(
        () =>
            selectedDocument
                ? documentHasChildren(items, selectedDocument)
                : false,
        [items, selectedDocument]
    );

    return (
        <div className={classes.root}>
            <div className={classes.treeContainer}>
                <div className={classes.treeToolbar}>
                    <Labeled
                        id="language"
                        label="resources.documents.fields.select_documentation_locale"
                    >
                        <LocaleSwitcherMenu
                            id="language"
                            locale={locale}
                            locales={supportedLocales}
                            onChange={handleLocaleChange}
                            className={classes.localeButton}
                        />
                    </Labeled>
                    {userCanEdit && (
                        <IconButton
                            className={classes.addRootDocumentationButton}
                            color="primary"
                            onClick={() => handleAddNewDocument()}
                            disabled={newDocument != null}
                            aria-label={translate(
                                'resources.documents.actions.new_document_button'
                            )}
                            title={translate(
                                'resources.documents.actions.new_document_button'
                            )}
                        >
                            <IconAdd />
                        </IconButton>
                    )}
                </div>
                <Divider />
                {locale && (
                    <DocumentationTree
                        className={classes.tree}
                        items={[
                            ...(newDocument != null ? [newDocument] : []),
                            ...items,
                        ]}
                        onDocumentSelected={handleSelectDocument}
                        selectedDocumentId={
                            newDocument != null
                                ? newDocument.id
                                : selectedDocumentId
                        }
                        expanded={expanded}
                        onExpandedChange={setExpanded}
                        onDocumentParentChange={handleDocumentParentChange}
                        canDrag={userCanEdit}
                    />
                )}
            </div>
            <div className={classes.documentation}>
                {selectedDocument && mode === 'view' ? (
                    <DocumentView
                        document={selectedDocument}
                        entityType={entityType}
                        entityUuid={entityUuid}
                        locale={locale}
                        userCanDelete={userCanDelete}
                        userCanEdit={userCanEdit}
                        hasChildren={hasChildren}
                        onEdit={handleEditDocument}
                        onAddNewDocument={handleAddNewDocument}
                        onDeleteDocument={handleDeleteDocument}
                        allDocuments={items}
                    />
                ) : null}
                {selectedDocument && mode === 'edit' ? (
                    <DocumentEdit
                        document={selectedDocument}
                        entityType={entityType}
                        entityUuid={entityUuid}
                        userCanDelete={userCanDelete}
                        userCanEdit={userCanEdit}
                        hasChildren={hasChildren}
                        onSave={handleSaveEditDocument}
                        onCancel={handleCancelEditDocument}
                        onAddNewDocument={handleAddNewDocument}
                        onDeleteDocument={handleDeleteDocument}
                    />
                ) : null}
                {newDocument && mode === 'add' ? (
                    <DocumentCreate
                        document={newDocument}
                        entityType={entityType}
                        entityUuid={entityUuid}
                        allDocuments={items}
                        onSaved={handleSaveNewDocument}
                        onCancel={handleCancelAddNewDocument}
                    />
                ) : null}
                {error && <NotFound />}
            </div>
        </div>
    );
};

function useQuery() {
    const location = useLocation();
    return parse(location.search);
}

function useDocumentationHistory(items, entityUuid, locale) {
    const history = useHistory();
    const query = useQuery();
    const dispatch = useDispatch();

    const selectedDocumentNavtitle = get(query, 'uri', null);

    const mode = get(query, 'mode', 'view');

    const selectedDocument =
        items.find(
            documentation => documentation.navtitle === selectedDocumentNavtitle
        ) || null;
    const selectedDocumentId = selectedDocument ? selectedDocument.id : null;
    const firstDocument = useMemo(() => getFirstDocument(items), [items]);

    useEffect(() => {
        const parents = getAllDocumentParents(selectedDocument, items).map(
            ({ id }) => id
        );

        if (parents.length > 0) {
            dispatch(addExpandedNodes(entityUuid, locale, parents));
        }
    }, [dispatch, items, locale, selectedDocument, entityUuid]);

    const openDocumentPage = useCallback(
        (document = null, mode = 'view', state = null) => {
            return history.push({
                pathname: history.location.pathname,
                search: stringify({
                    ...(document && { uri: document.navtitle }),
                    mode,
                }),
                ...(state != null && { state }),
            });
        },
        [history]
    );

    const openNewDocumentPage = state => {
        return openDocumentPage(null, 'add', state);
    };

    const closeDocumentPage = () => {
        return history.push({
            pathname: history.location.pathname,
        });
    };

    useEffect(() => {
        if (
            mode !== 'add' &&
            selectedDocumentNavtitle === null &&
            firstDocument !== null
        ) {
            openDocumentPage(firstDocument, 'view');
        }
    }, [
        firstDocument,
        items,
        mode,
        openDocumentPage,
        selectedDocument,
        selectedDocumentNavtitle,
    ]);

    return {
        // If a document was requested but not found
        error:
            selectedDocumentNavtitle && !selectedDocumentId
                ? 'resources.documents.notifications.not_found'
                : undefined,
        mode,
        selectedDocument,
        selectedDocumentId,
        openDocumentPage,
        openNewDocumentPage,
        closeDocumentPage,
    };
}

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'flex',
            height: '100%',
            minHeight: '550px',
        },
        treeContainer: {
            display: 'flex',
            flexDirection: 'column',
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(1),
            marginBottom: theme.spacing(1),
            padding: theme.spacing(1),
            paddingRight: theme.spacing(2),
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: '20%',
            borderStyle: 'solid',
            borderColor: theme.palette.divider,
            borderWidth: '0px 1px 0px 0px',
        },
        tree: {},
        treeToolbar: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        documentation: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            marginLeft: theme.spacing(1),
            padding: theme.spacing(1),
            flexGrow: 1,
        },
        localeButton: {
            width: '100%',
            justifyContent: 'space-between',
        },
        addRootDocumentationButton: {},
        leftIcon: {
            marginRight: theme.spacing(1),
        },
    }),
    {
        name: 'Layer7Documentation',
    }
);
