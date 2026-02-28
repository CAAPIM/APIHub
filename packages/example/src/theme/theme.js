// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { useMemo } from 'react';
import { theme as defaultTheme, useBranding } from 'layer7-apihub';
import { useTheme as useThemePreference } from 'react-admin';
import { merge } from 'lodash';
import { createTheme } from '@mui/material/styles';

import { useAppConfig } from '../contexts/ConfigContext';

const defaultDarkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const darkPalette = merge(defaultDarkTheme.palette, {
    primary: {
        main: '#90caf9',
        contrastText: '#ffffff',
    },
    secondary: {
        ...defaultTheme.palette.secondary,
        contrastText: '#ffffff',
    },
    text: {
        primary: '#ffffff',
        secondary: '#ffffff',
    },
    mode: 'dark',
});

export const darkTheme = createTheme(
    merge({}, defaultDarkTheme, defaultTheme, {
        palette: darkPalette,
        components: {
            MuiButton: {
                styleOverrides: {
                    containedPrimary: {
                        color: darkPalette.common.white,
                        backgroundColor: darkPalette.primary.main,
                    },
                    containedSecondary: {
                        color: darkPalette.common.white,
                        backgroundColor: darkPalette.secondary.main,
                    },
                    outlinedPrimary: {
                        color: darkPalette.primary.main,
                        borderColor: darkPalette.primary.main,
                    },
                    outlinedSecondary: {
                        color: darkPalette.common.white,
                        borderColor: darkPalette.common.white,
                    },
                    textPrimary: {
                        color: darkPalette.primary.main,
                    },
                    textSecondary: {
                        color: darkPalette.common.white,
                    },
                },
            },
            Layer7ApplicationOverviewField: {
                styleOverrides: {
                    overviewScrollFadeColor: {
                        background: `linear-gradient(to bottom, rgba(66, 66, 66, 0) 0%, rgba(66, 66, 66, 1) 100%)`,
                    },
                },
            },
        },
    })
);

export const lightTheme = defaultTheme;

export const useTheme = () => {
    const { APIHUB_URL, USE_BRANDING_THEME, TENANT_NAME, ORIGIN_HUB_NAME } =
        useAppConfig();

    const API_URL_WITH_TENANT =
        TENANT_NAME && APIHUB_URL ? `${APIHUB_URL}/api/${TENANT_NAME}` : null;
    const [themeMode] = useThemePreference();

    const { logo, theme } = useBranding(API_URL_WITH_TENANT, ORIGIN_HUB_NAME);

    const selectedTheme = useMemo(() => {
        if (USE_BRANDING_THEME) {
            return theme;
        }
        return themeMode === 'light' ? lightTheme : darkTheme;
    }, [USE_BRANDING_THEME, theme, themeMode]);

    return {
        theme: selectedTheme,
        logo,
    };
};
