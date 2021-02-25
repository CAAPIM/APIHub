import React from 'react';
import {
    createAdminStore,
    TestTranslationProvider,
    DataProviderContext,
} from 'ra-core';
import { Notification } from 'react-admin';
import { render, wait, fireEvent, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { Documentation } from './Documentation';
import { documentationReducer } from './documentationReducer';

const baseData = [
    {
        uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
        type: 'API',
        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
        locale: 'en-US',
        status: 'PUBLISHED',
        title: 'root',
        navtitle: 'root',
        ordinal: 0,
        modifyTs: 1584478726361,
        id: 'api/api-id/root/en-US',
        markdown: 'root-markdown',
    },
    {
        uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e8',
        type: 'API',
        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
        locale: 'en-US',
        parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
        status: 'PUBLISHED',
        title: 'child',
        navtitle: 'child',
        ordinal: 0,
        modifyTs: 1584559152069,
        id: 'api/api-id/child/en-US',
        markdown: 'child-markdown',
    },
];

describe('Documentation', () => {
    const history = createMemoryHistory();
    const getDataProvider = data => ({
        getList: jest.fn(() =>
            Promise.resolve({
                data,
                total: data.length,
            })
        ),
        getOne: jest.fn((resource, { id }) =>
            Promise.resolve({
                data: data.find(item => item.id === id),
            })
        ),
        update: jest.fn((resource, { id, data: updatedItem }) => {
            const index = data.findIndex(item => item.id === id);
            data[index] = updatedItem;

            return Promise.resolve({
                data: updatedItem,
            });
        }),
        updateTree: jest.fn().mockResolvedValue({ data: {} }),
        create: jest.fn((resource, { data: newItem }) => {
            data.push(newItem);
            return Promise.resolve({ data: newItem });
        }),
        delete: jest.fn((resource, { id, previousData }) => {
            data = data.filter(item => item.id !== id);

            return Promise.resolve({
                data: previousData,
            });
        }),
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderDocumentation = ({ data = baseData, ...props } = {}) => {
        const dataProvider = getDataProvider(Array.from(data));

        const store = createAdminStore({
            dataProvider,
            history,
            customReducers: documentationReducer,
            initialState: {
                admin: {
                    resources: {
                        documents: {},
                    },
                },
            },
        });

        return {
            store,
            dataProvider,
            ...render(
                <Provider store={store}>
                    <Router history={history}>
                        <DataProviderContext.Provider value={dataProvider}>
                            <TestTranslationProvider translate={key => key}>
                                <Documentation
                                    resource="documents"
                                    entityUuid="api-id"
                                    entityType="api"
                                    {...props}
                                />
                                <Notification />
                            </TestTranslationProvider>
                        </DataProviderContext.Provider>
                    </Router>
                </Provider>
            ),
        };
    };

    test('should display a tree of the documents', async () => {
        const { findByText, getByLabelText } = renderDocumentation();

        await findByText('root');

        fireEvent.click(
            getByLabelText('resources.documents.actions.expand_documentation')
        );
        await findByText('child');
    });

    test('should allow to expand and collapse using the icon buttons', async () => {
        const data = [
            {
                uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                status: 'PUBLISHED',
                title: 'root',
                navtitle: 'root',
                ordinal: 0,
                modifyTs: 1584478726361,
                id: 'api/api-id/root/en-US',
                markdown: 'root-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e8',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                status: 'PUBLISHED',
                title: 'child',
                navtitle: 'child',
                ordinal: 0,
                modifyTs: 1584559152069,
                id: 'api/api-id/child/en-US',
                markdown: 'child-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e9',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3a42e010-5e05-4086-9c41-d05a0c8032e8',
                status: 'PUBLISHED',
                title: 'child-child',
                navtitle: 'child-child',
                ordinal: 0,
                modifyTs: 1584559152069,
                id: 'api/api-id/child-child/en-US',
                markdown: 'child-child-markdown',
            },
        ];
        const {
            findByText,
            queryByText,
            getByLabelText,
            getAllByLabelText,
        } = renderDocumentation({
            data,
        });

        await findByText('root');

        fireEvent.click(
            getByLabelText('resources.documents.actions.expand_documentation')
        );
        await findByText('child');
        fireEvent.click(
            getByLabelText('resources.documents.actions.expand_documentation')
        );
        await findByText('child-child');
        fireEvent.click(
            getAllByLabelText(
                'resources.documents.actions.collapse_documentation'
            )[1]
        );
        await wait(() => {
            expect(queryByText('child-child')).toBeNull();
        });
        fireEvent.click(
            getAllByLabelText(
                'resources.documents.actions.collapse_documentation'
            )[0]
        );
        await wait(() => {
            expect(queryByText('child')).toBeNull();
        });
    });

    test('should select the first document by default', async () => {
        jest.setTimeout(10000);
        const { dataProvider, getByLabelText } = renderDocumentation({
            userCanEdit: true,
        });

        await wait(() => {
            // It should be selected which means its edit button should be visible
            getByLabelText('resources.documents.actions.edit_document_button');
        });

        expect(dataProvider.getOne).toHaveBeenCalled();
        expect(history.location.search).toEqual('?mode=view&uri=root');
    });

    test('should open a document directly in view mode', async () => {
        jest.setTimeout(10000);
        const { dataProvider, getByLabelText } = renderDocumentation({
            userCanEdit: true,
        });

        // Set the mode to edit and select the child document
        history.push({
            pathname: history.location.pathname,
            search: '?mode=view&uri=child',
        });

        await wait(() => {
            // It should be selected which means its edit button should be visible
            getByLabelText('resources.documents.actions.edit_document_button');
        });

        expect(dataProvider.getOne).toHaveBeenCalled();
        expect(history.location.search).toEqual('?mode=view&uri=child');
    });

    test('should open a document directly in edit mode', async () => {
        jest.setTimeout(10000);
        const { dataProvider, getByLabelText } = renderDocumentation({
            userCanEdit: true,
        });

        // Set the mode to edit and select the child document
        history.push({
            pathname: history.location.pathname,
            search: '?mode=edit&uri=child',
        });

        await wait(() => {
            // It should be selected which means its edit button should be visible
            getByLabelText('resources.documents.actions.edit_document_button');
        });

        expect(dataProvider.getOne).toHaveBeenCalled();
        expect(history.location.search).toEqual('?mode=edit&uri=child');
    });

    test('should show a message if the requested document cannot be found', async () => {
        jest.setTimeout(10000);
        const { dataProvider, getByText } = renderDocumentation({
            userCanEdit: true,
        });

        // Set the mode to edit and select the child document
        history.push({
            pathname: history.location.pathname,
            search: '?mode=view&uri=invalid_document',
        });

        await wait(() => {
            getByText('ra.page.not_found');
        });

        expect(history.location.search).toEqual(
            '?mode=view&uri=invalid_document'
        );
    });

    test.skip('should allow to create a new root document', async () => {
        jest.setTimeout(10000);
        const {
            dataProvider,
            findByText,
            findByLabelText,
            getAllByText,
            getByLabelText,
        } = renderDocumentation({
            userCanEdit: true,
        });

        await findByText('root');

        // Add a new root document
        fireEvent.click(
            getByLabelText('resources.documents.actions.new_document_button')
        );

        // Set the mode to add
        expect(history.location.search).toEqual('?mode=add');

        // Populate the document title
        const title = getByLabelText('resources.documents.fields.title *');
        fireEvent.focus(title);
        fireEvent.change(title, { target: { value: 'new-root' } });
        fireEvent.blur(title);

        // Which should update its navtitle automatically
        expect(
            getByLabelText('resources.documents.fields.navtitle *').value
        ).toEqual('new-root');

        // Populate its markdown content
        const markdown = getByLabelText(
            'resources.documents.fields.markdown *'
        );
        fireEvent.focus(markdown);
        fireEvent.change(markdown, { target: { value: 'new-root-markdown' } });
        fireEvent.blur(markdown);
        await wait(() => {
            // Which should update the preview
            expect(getAllByText('new-root-markdown').length).toEqual(2);
        });

        // Submit
        fireEvent.click(getByLabelText('resources.documents.actions.save'));

        await wait(() => {
            expect(dataProvider.create).toHaveBeenCalled();
        });

        await findByText('new-root', { selector: '[role="treeitem"] *' });
        // It should be selected which means its edit button should be visible
        await findByLabelText(
            'resources.documents.actions.edit_document_button'
        );
        await findByText('new-root-markdown');

        await wait(() => {
            // Set the mode to view and select the new root document
            expect(history.location.search).toEqual('?mode=view&uri=new-root');
        });
    });

    test.skip('should allow to create a new child document', async () => {
        jest.setTimeout(10000);
        const {
            dataProvider,
            findByText,
            findByLabelText,
            getByText,
            getAllByText,
            getByLabelText,
        } = renderDocumentation({
            userCanEdit: true,
        });

        await findByText('root');

        fireEvent.click(getByText('root'));

        // Set the mode to view and select the root document
        expect(history.location.search).toEqual('?mode=view&uri=root');

        await findByLabelText(
            'resources.documents.actions.new_child_document_button'
        );

        // Add a new root document
        fireEvent.click(
            getByLabelText(
                'resources.documents.actions.new_child_document_button'
            )
        );

        // Populate the document title
        const title = getByLabelText('resources.documents.fields.title *');
        fireEvent.focus(title);
        fireEvent.change(title, { target: { value: 'new-child' } });
        fireEvent.blur(title);

        // Which should update its navtitle automatically
        expect(
            getByLabelText('resources.documents.fields.navtitle *').value
        ).toEqual('new-child');

        // Populate its markdown content
        const markdown = getByLabelText(
            'resources.documents.fields.markdown *'
        );
        fireEvent.focus(markdown);
        fireEvent.change(markdown, { target: { value: 'new-child-markdown' } });
        fireEvent.blur(markdown);
        await wait(() => {
            // Which should update the preview
            expect(getAllByText('new-child-markdown').length).toEqual(2);
        });

        // Submit
        fireEvent.click(getByLabelText('resources.documents.actions.save'));

        await wait(() => {
            expect(dataProvider.create).toHaveBeenCalled();
        });

        await wait(() => {
            // The new child should appear in the tree under its parent
            const rootNodeListItem = getByText('root').parentElement
                .parentElement;
            within(rootNodeListItem).getByText('new-child', {
                selector: '[role="treeitem"] *',
            });
            // It should be selected which means its edit button should be visible
            getByLabelText('resources.documents.actions.edit_document_button');
        });

        await findByText('new-child-markdown');
        // Set the mode to view and select the new-child document
        expect(history.location.search).toEqual('?mode=view&uri=new-child');
    });

    test.skip('should not allow to create a new document using an existing navtitle', async () => {
        jest.setTimeout(10000);
        const {
            findByText,
            findByLabelText,
            getByText,
            getByLabelText,
            queryByText,
        } = renderDocumentation({
            userCanEdit: true,
        });

        await findByText('root');

        fireEvent.click(getByText('root'));

        // Set the mode to view and select the root document
        expect(history.location.search).toEqual('?mode=view&uri=root');

        await findByLabelText(
            'resources.documents.actions.new_child_document_button'
        );

        // Add a new root document
        fireEvent.click(
            getByLabelText(
                'resources.documents.actions.new_child_document_button'
            )
        );

        // Populate the document title
        const title = getByLabelText('resources.documents.fields.title *');
        fireEvent.focus(title);
        fireEvent.change(title, { target: { value: 'new-child' } });
        fireEvent.blur(title);

        const navtitle = getByLabelText(
            'resources.documents.fields.navtitle *'
        );
        fireEvent.focus(navtitle);
        fireEvent.change(navtitle, { target: { value: 'child' } });
        fireEvent.blur(navtitle);

        await wait(() => {
            expect(
                queryByText(
                    'resources.documents.validation.error_navtitle_not_unique'
                )
            ).not.toBeNull();
        });
    });

    test('should allow to edit an existing document', async () => {
        jest.setTimeout(10000);
        const {
            dataProvider,
            findByText,
            findByLabelText,
            getByText,
            getAllByText,
            getByLabelText,
        } = renderDocumentation({
            userCanEdit: true,
        });

        await findByText('root');

        fireEvent.click(getByText('root'));

        await findByText('child');

        fireEvent.click(getByText('child'));

        await findByText('child-markdown');
        await findByLabelText(
            'resources.documents.actions.edit_document_button'
        );

        // Edit the document
        fireEvent.click(
            getByLabelText('resources.documents.actions.edit_document_button')
        );

        // Set the mode to edit and select the child document
        expect(history.location.search).toEqual('?mode=edit&uri=child');

        await findByLabelText('resources.documents.fields.title *');

        // Populate the document title
        const title = getByLabelText('resources.documents.fields.title *');
        fireEvent.focus(title);
        fireEvent.change(title, { target: { value: 'child-updated' } });
        fireEvent.blur(title);

        // Populate its markdown content
        const markdown = getByLabelText(
            'resources.documents.fields.markdown *'
        );
        fireEvent.focus(markdown);
        fireEvent.change(markdown, { target: { value: 'child-markdown' } });
        fireEvent.blur(markdown);
        await wait(() => {
            // Which should update the preview
            expect(getAllByText('child-markdown').length).toEqual(2);
        });

        // Submit
        fireEvent.click(getByLabelText('resources.documents.actions.save'));

        await wait(() => {
            expect(dataProvider.update).toHaveBeenCalled();
        });

        await wait(() => {
            // The updated child should appear in the tree under its parent
            const rootNodeListItem = getByText('root').parentElement
                .parentElement;
            within(rootNodeListItem).getByText('child-updated', {
                selector: '[role="treeitem"] *',
            });

            // It should be selected which means its edit button should be visible
            getByLabelText('resources.documents.actions.edit_document_button');
        });

        // Set the mode to view and select the child document
        expect(history.location.search).toEqual('?mode=view&uri=child');
    });

    test('should allow to delete a document without children', async () => {
        jest.setTimeout(10000);

        global.window.confirm = jest.fn().mockImplementation(() => true);

        const {
            dataProvider,
            findByText,
            findByLabelText,
            getByText,
            queryByText,
            getByLabelText,
        } = renderDocumentation({
            userCanDelete: true,
            userCanEdit: true,
        });

        await findByText('child');

        fireEvent.click(getByText('child'));

        // Set the mode to view and select the child document
        expect(history.location.search).toEqual('?mode=view&uri=child');

        await findByText('child-markdown');
        await findByLabelText(
            'resources.documents.actions.delete_document_button'
        );

        // Delete the child document
        fireEvent.click(
            getByLabelText('resources.documents.actions.delete_document_button')
        );

        await wait(() => {
            getByText('resources.documents.notifications.delete_success');
        });

        expect(global.window.confirm).toHaveBeenCalledWith(
            'resources.documents.confirm_delete_document_without_children'
        );

        await wait(() => {
            expect(dataProvider.delete).toHaveBeenCalled();
        });

        await wait(() => {
            expect(queryByText('child-markdown')).toBeNull();
        });

        await findByText('root');
        await wait(() => {
            // The child should not appear in the tree under its parent anymore
            const rootNodeListItem = getByText('root').parentElement
                .parentElement;
            expect(
                within(rootNodeListItem).queryByText('child', {
                    selector: '[role="treeitem"] *',
                })
            ).toBeNull();
        });

        // Reset the location and select the first document
        expect(history.location.search).toEqual('?mode=view&uri=root');
    });

    test('should allow to delete a document with children', async () => {
        jest.setTimeout(10000);
        global.window.confirm = jest.fn().mockImplementation(() => true);

        const {
            dataProvider,
            findByText,
            findByLabelText,
            getByText,
            queryByText,
            getByLabelText,
        } = renderDocumentation({
            userCanDelete: true,
            userCanEdit: true,
        });

        await findByText('root');

        fireEvent.click(getByText('root'));

        // Set the mode to view and select the root document
        expect(history.location.search).toEqual('?mode=view&uri=root');

        await findByText('root-markdown');
        await findByLabelText(
            'resources.documents.actions.delete_document_button'
        );

        // Delete the root document
        fireEvent.click(
            getByLabelText('resources.documents.actions.delete_document_button')
        );
        await wait(() => {
            getByText('resources.documents.notifications.delete_success');
        });

        expect(global.window.confirm).toHaveBeenCalledWith(
            'resources.documents.confirm_delete_document_with_children'
        );

        // Click on something to disable the undo notification
        fireEvent.click(
            getByText('resources.documents.fields.select_documentation_locale')
        );

        await wait(() => {
            expect(dataProvider.delete).toHaveBeenCalled();
        });

        await wait(() => {
            expect(queryByText('root-markdown')).toBeNull();
        });
        await wait(() => {
            // The root node should not appear in the tree anymore
            expect(
                queryByText('root', {
                    selector: '[role="treeitem"] *',
                })
            ).toBeNull();
        });

        // Reset the location and select nothing because the root document has been removed
        expect(history.location.search).toEqual('?mode=view');
    });

    test('should not delete a document without user confirmation', async () => {
        jest.setTimeout(10000);
        global.window.confirm = jest.fn().mockImplementation(() => false);

        const {
            dataProvider,
            findByText,
            findByLabelText,
            getByText,
            queryByText,
            getByLabelText,
        } = renderDocumentation({
            userCanDelete: true,
            userCanEdit: true,
        });

        await findByText('root');

        fireEvent.click(getByText('root'));

        // Set the mode to view and select the root document
        expect(history.location.search).toEqual('?mode=view&uri=root');

        await findByText('root-markdown');
        await findByLabelText(
            'resources.documents.actions.delete_document_button'
        );

        // Delete the root document
        fireEvent.click(
            getByLabelText('resources.documents.actions.delete_document_button')
        );

        expect(global.window.confirm).toHaveBeenCalledWith(
            'resources.documents.confirm_delete_document_with_children'
        );

        // The document is not deleted
        expect(dataProvider.delete).not.toHaveBeenCalled();
        expect(queryByText('root-markdown')).not.toBeNull();

        // The mode is still "view" and the root document is still selected
        expect(history.location.search).toEqual('?mode=view&uri=root');
    });

    test('should allow to move an existing document to the root using the mouse', async () => {
        jest.setTimeout(10000);

        const data = [
            {
                uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                status: 'PUBLISHED',
                title: 'root',
                navtitle: 'root',
                ordinal: 0,
                modifyTs: 1584478726361,
                id: 'api/api-id/root/en-US',
                markdown: 'root-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e8',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                status: 'PUBLISHED',
                title: 'child',
                navtitle: 'child',
                ordinal: 0,
                modifyTs: 1584559152069,
                id: 'api/api-id/child/en-US',
                markdown: 'child-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032f9',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                status: 'PUBLISHED',
                title: 'another_child_same_level',
                navtitle: 'another_child_same_level',
                ordinal: 1,
                modifyTs: 1584559152069,
                id: 'api/api-id/another-child-same-level/en-US',
                markdown: 'another-child-same-level-markdown',
            },
            {
                uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                status: 'PUBLISHED',
                title: 'another_root',
                navtitle: 'another_root',
                ordinal: 1,
                modifyTs: 1584478726361,
                id: 'api/api-id/another_root/en-US',
                markdown: 'another-root-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e9',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                status: 'PUBLISHED',
                title: 'another_child',
                navtitle: 'another_child',
                ordinal: 0,
                modifyTs: 1584559152069,
                id: 'api/api-id/another_child/en-US',
                markdown: 'another_child-markdown',
            },
        ];

        const {
            dataProvider,
            findByText,
            findByLabelText,
            findAllByLabelText,
            getByText,
            queryByRole,
            queryByText,
        } = renderDocumentation({
            data,
            userCanEdit: true,
        });

        await findByText('root');

        fireEvent.click(getByText('root'));

        const nodeDragged = await findByLabelText('child');
        // Update the document parent
        fireEvent.dragStart(nodeDragged);

        const destination = (
            await findAllByLabelText('apihub.actions.tree_drop_before')
        )[0];
        fireEvent.dragEnter(destination);
        fireEvent.drop(destination);
        fireEvent.dragLeave(destination);
        fireEvent.dragEnd(nodeDragged);

        await wait(() => {
            expect(dataProvider.updateTree).toHaveBeenCalledWith('documents', {
                data: [
                    {
                        locale: 'en-US',
                        modifyTs: 1584478726361,
                        navtitle: 'root',
                        ordinal: 1,
                        status: 'PUBLISHED',
                        title: 'root',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                    },
                    {
                        locale: 'en-US',
                        modifyTs: 1584559152069,
                        navtitle: 'child',
                        ordinal: 0,
                        status: 'PUBLISHED',
                        title: 'child',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e8',
                    },
                    {
                        uuid: '3a42e010-5e05-4086-9c41-d05a0c8032f9',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        locale: 'en-US',
                        parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                        status: 'PUBLISHED',
                        title: 'another_child_same_level',
                        navtitle: 'another_child_same_level',
                        ordinal: 0,
                        modifyTs: 1584559152069,
                    },

                    {
                        locale: 'en-US',
                        modifyTs: 1584478726361,
                        navtitle: 'another_root',
                        ordinal: 2,
                        status: 'PUBLISHED',
                        title: 'another_root',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                    },
                    {
                        locale: 'en-US',
                        modifyTs: 1584559152069,
                        navtitle: 'another_child',
                        ordinal: 0,
                        parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                        status: 'PUBLISHED',
                        title: 'another_child',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e9',
                    },
                ],
                entityType: 'api',
                entityUuid: 'api-id',
                locale: 'en-US',
            });
            expect(queryByRole('dialog')).toBeNull();
            expect(
                queryByText(
                    'resources.documents.notifications.tree_updated_success'
                )
            ).toBeNull();
        });
    });

    test('should allow to move an existing document to the root using the keyboard', async () => {
        jest.setTimeout(10000);

        const data = [
            {
                uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                status: 'PUBLISHED',
                title: 'root',
                navtitle: 'root',
                ordinal: 0,
                modifyTs: 1584478726361,
                id: 'api/api-id/root/en-US',
                markdown: 'root-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e8',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                status: 'PUBLISHED',
                title: 'child',
                navtitle: 'child',
                ordinal: 0,
                modifyTs: 1584559152069,
                id: 'api/api-id/child/en-US',
                markdown: 'child-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032f9',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                status: 'PUBLISHED',
                title: 'another_child_same_level',
                navtitle: 'another_child_same_level',
                ordinal: 1,
                modifyTs: 1584559152069,
                id: 'api/api-id/another-child-same-level/en-US',
                markdown: 'another-child-same-level-markdown',
            },
            {
                uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                status: 'PUBLISHED',
                title: 'another_root',
                navtitle: 'another_root',
                ordinal: 1,
                modifyTs: 1584478726361,
                id: 'api/api-id/another_root/en-US',
                markdown: 'another-root-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e9',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                status: 'PUBLISHED',
                title: 'another_child',
                navtitle: 'another_child',
                ordinal: 0,
                modifyTs: 1584559152069,
                id: 'api/api-id/another_child/en-US',
                markdown: 'another_child-markdown',
            },
        ];

        const {
            dataProvider,
            findByText,
            findByLabelText,
            findAllByLabelText,
            getByText,
            queryByRole,
            queryByText,
        } = renderDocumentation({
            data,
            userCanEdit: true,
        });

        await findByText('root');

        fireEvent.click(getByText('root'));

        const nodeDragged = await findByLabelText('child');
        // Update the document parent
        fireEvent.keyDown(nodeDragged, { key: ' ' });

        const destination = (
            await findAllByLabelText('apihub.actions.tree_drop_before')
        )[0];
        fireEvent.keyDown(destination, { key: ' ' });

        await wait(() => {
            expect(dataProvider.updateTree).toHaveBeenCalledWith('documents', {
                data: [
                    {
                        locale: 'en-US',
                        modifyTs: 1584478726361,
                        navtitle: 'root',
                        ordinal: 1,
                        status: 'PUBLISHED',
                        title: 'root',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                    },
                    {
                        locale: 'en-US',
                        modifyTs: 1584559152069,
                        navtitle: 'child',
                        ordinal: 0,
                        status: 'PUBLISHED',
                        title: 'child',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e8',
                    },
                    {
                        uuid: '3a42e010-5e05-4086-9c41-d05a0c8032f9',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        locale: 'en-US',
                        parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                        status: 'PUBLISHED',
                        title: 'another_child_same_level',
                        navtitle: 'another_child_same_level',
                        ordinal: 0,
                        modifyTs: 1584559152069,
                    },

                    {
                        locale: 'en-US',
                        modifyTs: 1584478726361,
                        navtitle: 'another_root',
                        ordinal: 2,
                        status: 'PUBLISHED',
                        title: 'another_root',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                    },
                    {
                        locale: 'en-US',
                        modifyTs: 1584559152069,
                        navtitle: 'another_child',
                        ordinal: 0,
                        parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                        status: 'PUBLISHED',
                        title: 'another_child',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e9',
                    },
                ],
                entityType: 'api',
                entityUuid: 'api-id',
                locale: 'en-US',
            });
            expect(queryByRole('dialog')).toBeNull();
            expect(
                queryByText(
                    'resources.documents.notifications.tree_updated_success'
                )
            ).toBeNull();
        });
    });

    test('should allow to move an existing document as a child of another node using the mouse', async () => {
        jest.setTimeout(10000);

        const data = [
            {
                uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                status: 'PUBLISHED',
                title: 'root',
                navtitle: 'root',
                ordinal: 0,
                modifyTs: 1584478726361,
                id: 'api/api-id/root/en-US',
                markdown: 'root-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e8',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                status: 'PUBLISHED',
                title: 'child',
                navtitle: 'child',
                ordinal: 0,
                modifyTs: 1584559152069,
                id: 'api/api-id/child/en-US',
                markdown: 'child-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032f9',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                status: 'PUBLISHED',
                title: 'another_child_same_level',
                navtitle: 'another_child_same_level',
                ordinal: 1,
                modifyTs: 1584559152069,
                id: 'api/api-id/another-child-same-level/en-US',
                markdown: 'another-child-same-level-markdown',
            },
            {
                uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                status: 'PUBLISHED',
                title: 'another_root',
                navtitle: 'another_root',
                ordinal: 1,
                modifyTs: 1584478726361,
                id: 'api/api-id/another_root/en-US',
                markdown: 'another-root-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e9',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                status: 'PUBLISHED',
                title: 'another_child',
                navtitle: 'another_child',
                ordinal: 0,
                modifyTs: 1584559152069,
                id: 'api/api-id/another_child/en-US',
                markdown: 'another_child-markdown',
            },
        ];

        const {
            dataProvider,
            findByText,
            findByLabelText,
            getByText,
            queryByRole,
            queryByText,
        } = renderDocumentation({
            data,
            userCanEdit: true,
        });

        await findByText('root');

        fireEvent.click(getByText('root'));

        const nodeDragged = await findByLabelText('child');
        // Update the document parent
        fireEvent.dragStart(nodeDragged);

        const destination = await findByLabelText('another_root');
        fireEvent.dragEnter(destination);
        fireEvent.drop(destination);
        fireEvent.dragLeave(destination);
        fireEvent.dragEnd(nodeDragged);

        await wait(() => {
            expect(dataProvider.updateTree).toHaveBeenCalledWith('documents', {
                data: [
                    {
                        locale: 'en-US',
                        modifyTs: 1584478726361,
                        navtitle: 'root',
                        ordinal: 0,
                        status: 'PUBLISHED',
                        title: 'root',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                    },
                    {
                        locale: 'en-US',
                        modifyTs: 1584559152069,
                        navtitle: 'child',
                        ordinal: 1,
                        status: 'PUBLISHED',
                        title: 'child',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e8',
                        parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                    },
                    {
                        uuid: '3a42e010-5e05-4086-9c41-d05a0c8032f9',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        locale: 'en-US',
                        parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                        status: 'PUBLISHED',
                        title: 'another_child_same_level',
                        navtitle: 'another_child_same_level',
                        ordinal: 0,
                        modifyTs: 1584559152069,
                    },
                    {
                        locale: 'en-US',
                        modifyTs: 1584478726361,
                        navtitle: 'another_root',
                        ordinal: 1,
                        status: 'PUBLISHED',
                        title: 'another_root',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                    },
                    {
                        locale: 'en-US',
                        modifyTs: 1584559152069,
                        navtitle: 'another_child',
                        ordinal: 0,
                        parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                        status: 'PUBLISHED',
                        title: 'another_child',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e9',
                    },
                ],
                entityType: 'api',
                entityUuid: 'api-id',
                locale: 'en-US',
            });
            expect(queryByRole('dialog')).toBeNull();
            expect(
                queryByText(
                    'resources.documents.notifications.tree_updated_success'
                )
            ).toBeNull();
        });
    });

    test('should allow to move an existing document as a child of another node using the keyboard', async () => {
        jest.setTimeout(10000);

        const data = [
            {
                uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                status: 'PUBLISHED',
                title: 'root',
                navtitle: 'root',
                ordinal: 0,
                modifyTs: 1584478726361,
                id: 'api/api-id/root/en-US',
                markdown: 'root-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e8',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                status: 'PUBLISHED',
                title: 'child',
                navtitle: 'child',
                ordinal: 0,
                modifyTs: 1584559152069,
                id: 'api/api-id/child/en-US',
                markdown: 'child-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032f9',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                status: 'PUBLISHED',
                title: 'another_child_same_level',
                navtitle: 'another_child_same_level',
                ordinal: 1,
                modifyTs: 1584559152069,
                id: 'api/api-id/another-child-same-level/en-US',
                markdown: 'another-child-same-level-markdown',
            },
            {
                uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                status: 'PUBLISHED',
                title: 'another_root',
                navtitle: 'another_root',
                ordinal: 1,
                modifyTs: 1584478726361,
                id: 'api/api-id/another_root/en-US',
                markdown: 'another-root-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e9',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                status: 'PUBLISHED',
                title: 'another_child',
                navtitle: 'another_child',
                ordinal: 0,
                modifyTs: 1584559152069,
                id: 'api/api-id/another_child/en-US',
                markdown: 'another_child-markdown',
            },
        ];

        const {
            dataProvider,
            findByText,
            findByLabelText,
            findAllByLabelText,
            getByText,
            queryByRole,
            queryByText,
        } = renderDocumentation({
            data,
            userCanEdit: true,
        });

        await findByText('root');

        fireEvent.click(getByText('root'));

        const nodeDragged = await findByLabelText('child');
        // Update the document parent
        fireEvent.keyDown(nodeDragged, { key: ' ' });

        const destination = (await findAllByLabelText('another_root'))[0];
        fireEvent.keyDown(destination, { key: ' ' });

        await wait(() => {
            expect(dataProvider.updateTree).toHaveBeenCalledWith('documents', {
                data: [
                    {
                        locale: 'en-US',
                        modifyTs: 1584478726361,
                        navtitle: 'root',
                        ordinal: 0,
                        status: 'PUBLISHED',
                        title: 'root',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                    },
                    {
                        locale: 'en-US',
                        modifyTs: 1584559152069,
                        navtitle: 'child',
                        ordinal: 1,
                        status: 'PUBLISHED',
                        title: 'child',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e8',
                        parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                    },
                    {
                        uuid: '3a42e010-5e05-4086-9c41-d05a0c8032f9',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        locale: 'en-US',
                        parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                        status: 'PUBLISHED',
                        title: 'another_child_same_level',
                        navtitle: 'another_child_same_level',
                        ordinal: 0,
                        modifyTs: 1584559152069,
                    },

                    {
                        locale: 'en-US',
                        modifyTs: 1584478726361,
                        navtitle: 'another_root',
                        ordinal: 1,
                        status: 'PUBLISHED',
                        title: 'another_root',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                    },
                    {
                        locale: 'en-US',
                        modifyTs: 1584559152069,
                        navtitle: 'another_child',
                        ordinal: 0,
                        parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                        status: 'PUBLISHED',
                        title: 'another_child',
                        type: 'API',
                        typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                        uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e9',
                    },
                ],
                entityType: 'api',
                entityUuid: 'api-id',
                locale: 'en-US',
            });
            expect(queryByRole('dialog')).toBeNull();
            expect(
                queryByText(
                    'resources.documents.notifications.tree_updated_success'
                )
            ).toBeNull();
        });
    });

    test('should not allow to move an existing document using the mouse if the user has no edit rights', async () => {
        jest.setTimeout(10000);

        const data = [
            {
                uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                status: 'PUBLISHED',
                title: 'root',
                navtitle: 'root',
                ordinal: 0,
                modifyTs: 1584478726361,
                id: 'api/api-id/root/en-US',
                markdown: 'root-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e8',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                status: 'PUBLISHED',
                title: 'child',
                navtitle: 'child',
                ordinal: 0,
                modifyTs: 1584559152069,
                id: 'api/api-id/child/en-US',
                markdown: 'child-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032f9',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                status: 'PUBLISHED',
                title: 'another_child_same_level',
                navtitle: 'another_child_same_level',
                ordinal: 1,
                modifyTs: 1584559152069,
                id: 'api/api-id/another-child-same-level/en-US',
                markdown: 'another-child-same-level-markdown',
            },
            {
                uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                status: 'PUBLISHED',
                title: 'another_root',
                navtitle: 'another_root',
                ordinal: 1,
                modifyTs: 1584478726361,
                id: 'api/api-id/another_root/en-US',
                markdown: 'another-root-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e9',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                status: 'PUBLISHED',
                title: 'another_child',
                navtitle: 'another_child',
                ordinal: 0,
                modifyTs: 1584559152069,
                id: 'api/api-id/another_child/en-US',
                markdown: 'another_child-markdown',
            },
        ];

        const {
            findByText,
            findByLabelText,
            queryAllByLabelText,
            getByText,
        } = renderDocumentation({
            data,
            userCanEdit: false,
        });

        await findByText('root');

        fireEvent.click(getByText('root'));

        const nodeDragged = await findByLabelText('child');

        // Start dragging using the mouse
        fireEvent.dragStart(nodeDragged);

        const destination = await queryAllByLabelText(
            'apihub.actions.tree_drop_before'
        );

        expect(destination.length).toEqual(0);
    });

    test('should not allow to move an existing document using the keyboard if the user has no edit rights', async () => {
        jest.setTimeout(10000);

        const data = [
            {
                uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                status: 'PUBLISHED',
                title: 'root',
                navtitle: 'root',
                ordinal: 0,
                modifyTs: 1584478726361,
                id: 'api/api-id/root/en-US',
                markdown: 'root-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e8',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                status: 'PUBLISHED',
                title: 'child',
                navtitle: 'child',
                ordinal: 0,
                modifyTs: 1584559152069,
                id: 'api/api-id/child/en-US',
                markdown: 'child-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032f9',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e1',
                status: 'PUBLISHED',
                title: 'another_child_same_level',
                navtitle: 'another_child_same_level',
                ordinal: 1,
                modifyTs: 1584559152069,
                id: 'api/api-id/another-child-same-level/en-US',
                markdown: 'another-child-same-level-markdown',
            },
            {
                uuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                status: 'PUBLISHED',
                title: 'another_root',
                navtitle: 'another_root',
                ordinal: 1,
                modifyTs: 1584478726361,
                id: 'api/api-id/another_root/en-US',
                markdown: 'another-root-markdown',
            },
            {
                uuid: '3a42e010-5e05-4086-9c41-d05a0c8032e9',
                type: 'API',
                typeUuid: '130591f1-af8b-4885-82dd-00a742797264',
                locale: 'en-US',
                parentUuid: '3f1fb2de-dc3c-45c3-9901-8de8920739e2',
                status: 'PUBLISHED',
                title: 'another_child',
                navtitle: 'another_child',
                ordinal: 0,
                modifyTs: 1584559152069,
                id: 'api/api-id/another_child/en-US',
                markdown: 'another_child-markdown',
            },
        ];

        const {
            findByText,
            findByLabelText,
            queryAllByLabelText,
            getByText,
        } = renderDocumentation({
            data,
            userCanEdit: false,
        });

        await findByText('root');

        fireEvent.click(getByText('root'));

        const nodeDragged = await findByLabelText('child');

        // Start dragging using the mouse
        fireEvent.dragStart(nodeDragged);

        // Start dragging using the keyboard
        fireEvent.keyDown(nodeDragged, { key: ' ' });

        const destination = await queryAllByLabelText(
            'apihub.actions.tree_drop_before'
        );

        expect(destination.length).toEqual(0);
    });
});
