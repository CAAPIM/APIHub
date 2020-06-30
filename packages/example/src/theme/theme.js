import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { theme as defaultTheme, useBranding } from 'layer7-apihub';
import merge from 'lodash/merge';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import createPalette from '@material-ui/core/styles/createPalette';

export const CHANGE_THEME = 'CHANGE_THEME';

export const themeReducer = (previousState = 'light', { type, payload }) => {
    if (type === CHANGE_THEME) {
        return payload;
    }
    return previousState;
};

export const changeTheme = newTheme => ({
    type: CHANGE_THEME,
    payload: newTheme,
});

const darkPalette = createPalette({
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
    type: 'dark',
});

export const darkTheme = createMuiTheme(
    merge({}, defaultTheme, {
        palette: darkPalette,
        overrides: {
            MuiButton: {
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
            Layer7ApplicationOverviewField: {
                overviewScrollFadeColor: {
                    background: `linear-gradient(to bottom, rgba(66, 66, 66, 0) 0%, rgba(66, 66, 66, 1) 100%)`,
                },
            },
        },
    })
);

export const lightTheme = defaultTheme;

export const useTheme = () => {
    const { APIHUB_URL, USE_BRANDING_THEME } = global.APIHUB_CONFIG;
    const { theme: brandingTheme } = useBranding(APIHUB_URL);

    const themeMode = useSelector(state => state.theme);

    const theme = useMemo(() => {
        if (USE_BRANDING_THEME) {
            return brandingTheme;
        }
        return themeMode === 'light' ? lightTheme : darkTheme;
    }, [USE_BRANDING_THEME, brandingTheme, themeMode]);

    return theme;
};
