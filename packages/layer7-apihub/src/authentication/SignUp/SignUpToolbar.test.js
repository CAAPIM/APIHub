// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';

import { SignUpToolbar } from './SignUpToolbar';
import { AdminContext } from 'react-admin';

describe('SignUpToolbar', () => {
    test('should display a loading spinner when loading', () => {
        const { findByText } = render(
            <AdminContext>
                <SignUpToolbar loading />
            </AdminContext>
        );

        expect(findByText('progressbar')).not.toBeNull();
    });

    test('should display an error if error is passed', async () => {
        const { findByText } = render(
            <AdminContext>
                <SignUpToolbar error="apihub.sign_up.notifications.confirmation_required" />
            </AdminContext>
        );

        expect(
            findByText('apihub.sign_up.notifications.confirmation_required')
        ).not.toBeNull();
    });
});
