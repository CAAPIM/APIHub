// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import {
    ThemeProvider,
    StyledEngineProvider,
    createTheme,
} from '@mui/material/styles';

import { useTheme } from '../theme';
import { ThemedAuthenticationLayout } from './ThemedAuthenticationLayout';

export const AuthenticationLayout = props => {
    const { theme } = useTheme();
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={createTheme(theme)}>
                <ThemedAuthenticationLayout {...props} />
            </ThemeProvider>
        </StyledEngineProvider>
    );
};
