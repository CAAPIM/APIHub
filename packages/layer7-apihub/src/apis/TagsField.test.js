// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import {
    configure,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react';

import { AsyncTagsField, TagsField, TagsFieldScrollButton } from './TagsField';
import { AdminContext } from 'react-admin';

describe('TagsField', () => {
    beforeAll(() => {
        configure({
            testIdAttribute: 'data-layer7-test',
        });
    });
    describe('TagsField', () => {
        test('should render all tags', () => {
            const { queryByText } = render(
                <TagsField
                    source="tags"
                    record={{ tags: ['test', 'another test'] }}
                />
            );

            expect(queryByText('test')).not.toBeNull();
            expect(queryByText('another test')).not.toBeNull();
        });
    });
    describe('AsyncTagsField', () => {
        const dataProvider = {
            getManyReference: jest.fn().mockResolvedValue({
                data: [
                    {
                        uuid: 'd9a2909c-b532-4a8a-8a39-e17001e9b225',
                        id: 'd9a2909c-b532-4a8a-8a39-e17001e9b225',
                        name: 'Accounts',
                    },
                    {
                        uuid: '9a7d8894-5e40-47b8-8d92-f9270516b526',
                        id: '9a7d8894-5e40-47b8-8d92-f9270516b526',
                        name: 'Security',
                    },
                    {
                        uuid: '41c60b1e-80c6-4dd5-9a6f-da2fd1924cb6',
                        id: '41c60b1e-80c6-4dd5-9a6f-da2fd1924cb6',
                        name: 'Plans',
                    },
                ],
                total: 3,
            }),
        };

        test('should render the AsyncTagsField component', async () => {
            const { getByText } = render(
                <AdminContext dataProvider={dataProvider}>
                    <AsyncTagsField
                        record={{
                            id: '123',
                        }}
                    />
                </AdminContext>
            );

            await waitFor(() => {
                expect(getByText('Accounts')).not.toBeNull();
            });
        });
    });
    describe('TagsFieldScrollButton', () => {
        test('should render the TagsFieldScrollButton component', () => {
            const onClick = jest.fn();
            render(<TagsFieldScrollButton onClick={onClick} />);
            fireEvent.click(screen.getByTestId('tags-scroll-button'));
            expect(onClick).toHaveBeenCalled();
        });
    });
});
