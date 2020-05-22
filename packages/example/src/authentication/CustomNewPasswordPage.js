import React from 'react';
import { NewPasswordPage } from 'layer7-apihub';

import { CustomAuthenticationLayout } from './CustomAuthenticationLayout';

export const CustomNewPasswordPage = props => (
    <NewPasswordPage Layout={CustomAuthenticationLayout} {...props} />
);
