// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';

import { LoginToolbar } from './LoginToolbar';
import { AdminContext } from 'react-admin';

describe('LoginToolbar', () => {
    test('should display a loading spinner when loading', () => {
        const { findByText } = render(
            <AdminContext>
                <LoginToolbar loading />
            </AdminContext>
        );

        expect(findByText('progressbar')).not.toBeNull();
    });

    test('should display an error if error is passed', async () => {
        const { findByText } = render(
            <AdminContext>
                <LoginToolbar error="apihub.login.notifications.invalid_credentials" />
            </AdminContext>
        );

        expect(
            findByText('apihub.login.notifications.invalid_credentials')
        ).not.toBeNull();
    });
});
