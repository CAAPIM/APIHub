import React from 'react';
import { SignUpPage } from 'layer7-apihub';

import { CustomAuthenticationLayout } from './CustomAuthenticationLayout';

export const CustomSignUpPage = props => (
    <SignUpPage Layout={CustomAuthenticationLayout} {...props} />
);
