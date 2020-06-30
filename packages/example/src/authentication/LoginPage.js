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
