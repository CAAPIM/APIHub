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
