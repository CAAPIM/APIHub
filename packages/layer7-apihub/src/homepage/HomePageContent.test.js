// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { fireEvent, waitFor, render } from '@testing-library/react';

import { HomePageContent } from './HomePageContent';
import { CurrentUserId } from '../dataProvider/userContexts';
import { AdminContext } from 'react-admin';

describe('HomePageContent', () => {
    const initialState = {
        admin: {
            resources: {
                documents: { data: {} },
                userContexts: { data: {} },
            },
        },
    };

    test('should render the empty state if the document does not exist', async () => {
        const dataProvider = {
            getOne: jest.fn().mockImplementation(resource => {
                if (resource === 'documents') {
                    return Promise.resolve({ data: {} });
                }
                if (resource === 'userContexts') {
                    return Promise.resolve({
                        data: {
                            id: CurrentUserId,
                            userDetails: {
                                portalAdmin: true,
                            },
                        },
                    });
                }
            }),
        };

        const { findByText } = render(
            <AdminContext dataProvider={dataProvider}>
                <HomePageContent />
            </AdminContext>
        );

        await waitFor(() => {
            findByText('apihub.homepage.placeholder_empty_content');
        });
    });

    test('should not render the create button when the document does not exist and the user is not a portal admin', async () => {
        const dataProvider = {
            getOne: jest.fn().mockImplementation(resource => {
                if (resource === 'documents') {
                    return Promise.resolve({ data: {} });
                }
                if (resource === 'userContexts') {
                    return Promise.resolve({
                        data: {
                            id: CurrentUserId,
                            userDetails: {
                                portalAdmin: false,
                            },
                        },
                    });
                }
            }),
        };

        const { findByText, queryByText } = render(
            <AdminContext dataProvider={dataProvider}>
                <HomePageContent />
            </AdminContext>
        );

        await waitFor(() => {
            findByText('apihub.homepage.placeholder_empty_content');
        });
        expect(queryByText('ra.action.create')).toBeNull();
    });

    test('should not render the edit button when the document exist and the user is not a portal admin', async () => {
        const dataProvider = {
            getOne: jest.fn().mockImplementation(resource => {
                if (resource === 'documents') {
                    return Promise.resolve({
                        data: {
                            id: 'home/home1/home1/en-US',
                            navtitle: 'home1',
                            markdown: 'some markdown',
                        },
                    });
                }
                if (resource === 'userContexts') {
                    return Promise.resolve({
                        data: {
                            id: CurrentUserId,
                            userDetails: {
                                portalAdmin: false,
                            },
                        },
                    });
                }
            }),
        };

        const { findByText, queryByText } = render(
            <AdminContext dataProvider={dataProvider}>
                <HomePageContent navtitle="home1" />
            </AdminContext>
        );

        await waitFor(() => {
            findByText('some markdown');
        });
        expect(queryByText('ra.action.edit')).toBeNull();
    });

    test.skip('should allow to create a new document when the document does not exist and the user is a portal admin', async () => {
        jest.setTimeout(10000);
        let document = { id: CurrentUserId };
        const dataProvider = {
            getOne: jest.fn().mockImplementation(resource => {
                if (resource === 'documents') {
                    return Promise.resolve({ data: document });
                }
                if (resource === 'userContexts') {
                    return Promise.resolve({
                        data: {
                            id: CurrentUserId,
                            userDetails: {
                                portalAdmin: true,
                            },
                        },
                    });
                }
            }),
            create: jest.fn().mockImplementation((resource, { data }) => {
                if (resource === 'documents') {
                    document = { ...data };
                    return Promise.resolve({ data });
                }
            }),
        };

        const {
            findByText,
            findAllByText,
            getByText,
            getByLabelText,
            findByRole,
            queryByRole,
        } = render(
            <AdminContext dataProvder={dataProvider}>
                <HomePageContent />
            </AdminContext>
        );

        await findByText('apihub.homepage.placeholder_empty_content');
        fireEvent.click(getByLabelText('ra.action.create'));

        const dialog = await findByRole('dialog');
        fireEvent.change(
            getByLabelText('resources.documents.fields.markdown', {
                container: dialog,
            }),
            { target: { value: 'some markdown' } }
        );

        expect(
            (await findAllByText('some markdown', { container: dialog })).length
        ).toBeGreaterThan(0);

        fireEvent.click(
            getByText('resources.documents.actions.save', { container: dialog })
        );
        expect(dataProvider.create).toHaveBeenCalled();

        await waitFor(() => {
            expect(queryByRole('dialog')).toBeNull();
        });

        expect(await findByText('some markdown'));
    });

    test.skip('should allow to update an existing document if the user is a portal admin', async () => {
        jest.setTimeout(10000);
        let document = {
            id: 'home/home1/home1/en-US',
            navtitle: 'home1',
            markdown: 'some markdown',
        };

        const dataProvider = {
            getOne: jest.fn(resource => {
                if (resource === 'documents') {
                    return Promise.resolve({ data: document });
                } else {
                    return Promise.resolve({
                        data: {
                            id: CurrentUserId,
                            userDetails: {
                                portalAdmin: true,
                            },
                        },
                    });
                }
            }),
            create: jest.fn((resource, { data }) => {
                if (resource === 'documents') {
                    document = { ...data };
                    return Promise.resolve({ data });
                }
            }),
            update: jest.fn((resource, { data }) => {
                if (resource === 'documents') {
                    document = { ...data };
                }
            }),
        };

        const {
            findByText,
            findAllByText,
            getByText,
            getByLabelText,
            findByRole,
            queryByRole,
        } = render(
            <AdminContext dataProvider={dataProvider}>
                <HomePageContent />
            </AdminContext>
        );

        await findByText('some markdown');
        fireEvent.click(getByLabelText('ra.action.edit'));

        const dialog = await findByRole('dialog');
        fireEvent.change(
            getByLabelText('resources.documents.fields.markdown', {
                container: dialog,
            }),
            { target: { value: 'some even better markdown' } }
        );

        expect(
            (
                await findAllByText('some even better markdown', {
                    container: dialog,
                })
            ).length
        ).toBeGreaterThan(0);

        fireEvent.click(
            getByText('resources.documents.actions.save', { container: dialog })
        );

        await waitFor(() => {
            expect(queryByRole('dialog')).toBeNull();
        });

        expect(await findByText('some even better markdown'));
    });
});
