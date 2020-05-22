import React from 'react';
import { AccountSetupPage } from 'layer7-apihub';

import { CustomAuthenticationLayout } from './CustomAuthenticationLayout';

export const CustomAccountSetupPage = props => (
    <AccountSetupPage Layout={CustomAuthenticationLayout} {...props} />
);
