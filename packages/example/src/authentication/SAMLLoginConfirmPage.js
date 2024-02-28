import React from 'react';
import { SAMLLoginConfirm } from 'layer7-apihub';

import { AuthenticationLayout } from './AuthenticationLayout';

export const SAMLLoginConfirmPage = () => (
    <AuthenticationLayout>
        <SAMLLoginConfirm
            toolbarProps={{
                button: {
                    variant: 'contained',
                },
            }}
        />
    </AuthenticationLayout>
);
