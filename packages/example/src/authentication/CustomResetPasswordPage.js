import React from 'react';
import { ResetPasswordPage } from 'layer7-apihub';

import { CustomAuthenticationLayout } from './CustomAuthenticationLayout';

export const CustomResetPasswordPage = props => (
    <ResetPasswordPage Layout={CustomAuthenticationLayout} {...props} />
);
