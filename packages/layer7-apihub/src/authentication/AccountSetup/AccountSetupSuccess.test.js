// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { render } from '@testing-library/react';

import { AccountSetupSuccess } from './AccountSetupSuccess';
import { AdminContext } from 'react-admin';

describe('AccountSetupSuccess', () => {
    it('renders a success notification', () => {
        const { getByText } = render(
            <AdminContext>
                <AccountSetupSuccess />
            </AdminContext>
        );

        expect(
            getByText('apihub.account_setup.notifications.success')
        ).not.toBeNull();
    });
});
