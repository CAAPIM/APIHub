import React from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { useTheme } from '../theme';
import { ThemedLayout } from './ThemedLayout';

export const AuthenticatedLayout = props => {
    const { theme } = useTheme();

    return (
        <ThemeProvider theme={createMuiTheme(theme)}>
            <ThemedLayout {...props} />
        </ThemeProvider>
    );
};
