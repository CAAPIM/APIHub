import React from 'react';
import { LoginPage } from 'layer7-apihub';

import { CustomAuthenticationLayout } from './CustomAuthenticationLayout';

export const CustomLoginPage = props => (
    <LoginPage Layout={CustomAuthenticationLayout} {...props} />
);
