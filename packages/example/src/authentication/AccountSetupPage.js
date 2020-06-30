import React from 'react';
import { AccountSetup } from 'layer7-apihub';

import { AuthenticationLayout } from './AuthenticationLayout';

export const AccountSetupPage = () => (
    <AuthenticationLayout>
        <AccountSetup
            toolbarProps={{
                button: {
                    variant: 'contained',
                },
            }}
        />
    </AuthenticationLayout>
);
