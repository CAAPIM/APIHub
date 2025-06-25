// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { VisibilityField } from './VisibilityField';
import { render } from '@testing-library/react';
import { AdminContext } from 'react-admin';

describe('VisibilityField', () => {
    test('should render the status', () => {
        const { getByText } = render(
            <AdminContext>
                <VisibilityField
                    record={{ accessStatus: 'ENABLED' }}
                    source="accessStatus"
                />
            </AdminContext>
        );
        expect(getByText('resources.apis.accessStatus.enabled')).not.toBeNull();
    });
});
