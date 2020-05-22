import React from 'react';
import { ApiHubLayout } from 'layer7-apihub';

import { useTheme } from '../theme';
import { CustomAppBar } from './CustomAppBar';

export const CustomLayout = props => {
    const theme = useTheme();

    return <ApiHubLayout appBar={CustomAppBar} {...props} theme={theme} />;
};
