import React from 'react';
import { AuthenticationLayout } from 'layer7-apihub';

import { useTheme } from '../theme';
import { CustomHeader } from '../ui/CustomHeader';
import { CustomFooter } from '../ui/CustomFooter';
import { CustomContent } from './CustomContent';

export const CustomAuthenticationLayout = props => {
    const theme = useTheme();

    return (
        <AuthenticationLayout
            Header={CustomHeader}
            Content={CustomContent}
            Footer={CustomFooter}
            {...props}
            theme={theme}
        />
    );
};
