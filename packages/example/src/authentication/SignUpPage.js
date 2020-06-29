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
