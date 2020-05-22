import React from 'react';
import { render } from '@testing-library/react';
import expect from 'expect';

import { TagsField } from './TagsField';

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
