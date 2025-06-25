// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { ResetPassword } from 'layer7-apihub';

import { AuthenticationLayout } from './AuthenticationLayout';

export const ResetPasswordPage = () => {
    return (
        <AuthenticationLayout>
            <ResetPassword
                toolbarProps={{
                    button: {
                        variant: 'contained',
                    },
                }}
            />
        </AuthenticationLayout>
    );
};
