import React from 'react';
import { renderWithRedux } from 'react-admin';
import { VisibilityField } from './VisibilityField';

describe('VisibilityField', () => {
    test('should render the status', () => {
        const { getByText } = renderWithRedux(
            <VisibilityField
                record={{ accessStatus: 'ENABLED' }}
                source="accessStatus"
            />
        );
        expect(getByText('resources.apis.accessStatus.enabled')).not.toBeNull();
    });
});
