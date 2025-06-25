// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { NewPassword } from 'layer7-apihub';

import { AuthenticationLayout } from './AuthenticationLayout';

export const NewPasswordPage = () => {
    return (
        <AuthenticationLayout>
            <NewPassword
                toolbarProps={{
                    button: {
                        variant: 'contained',
                    },
                }}
            />
        </AuthenticationLayout>
    );
};
