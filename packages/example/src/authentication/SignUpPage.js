// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { SignUp } from 'layer7-apihub';

import { AuthenticationLayout } from './AuthenticationLayout';

export const SignUpPage = () => (
    <AuthenticationLayout>
        <SignUp
            toolbarProps={{
                button: {
                    variant: 'contained',
                },
            }}
        />
    </AuthenticationLayout>
);
