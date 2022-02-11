import React from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { useTheme } from '../theme';
import { ThemedAuthenticationLayout } from './ThemedAuthenticationLayout';

export const AuthenticationLayout = props => {
    const { theme } = useTheme();

    return (
        <ThemeProvider theme={createMuiTheme(theme)}>
            <ThemedAuthenticationLayout {...props} />
        </ThemeProvider>
    );
};
