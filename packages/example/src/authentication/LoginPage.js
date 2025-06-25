// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { Login } from 'layer7-apihub';

import { AuthenticationLayout } from './AuthenticationLayout';

export const LoginPage = () => (
    <AuthenticationLayout>
        <Login
            toolbarProps={{
                button: {
                    variant: 'contained',
                },
            }}
        />
    </AuthenticationLayout>
);
