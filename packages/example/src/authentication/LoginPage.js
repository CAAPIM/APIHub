import React from 'react';
import { Login } from 'layer7-apihub';

import { AuthenticationLayout } from './AuthenticationLayout';

export const LoginPage = () => {
    return (
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
};
