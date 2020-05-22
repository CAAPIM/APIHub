import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { theme as defaultTheme, useBranding } from 'layer7-apihub';
import merge from 'lodash/fp/merge';

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

export const darkTheme = merge({}, defaultTheme, {
    palette: {
        primary: {
            main: '#90caf9',
        },
        type: 'dark',
    },
});

export const lightTheme = defaultTheme;

export const useTheme = () => {
    const { APIHUB_URL, USE_BRANDING_THEME } = global.APIHUB_CONFIG;
    const { theme: brandingTheme } = useBranding(APIHUB_URL);

    const brandingLightTheme = USE_BRANDING_THEME
        ? merge(lightTheme, brandingTheme)
        : lightTheme;
    const brandingDarkTheme = USE_BRANDING_THEME
        ? merge(darkTheme, brandingTheme)
        : darkTheme;

    const themeMode = useSelector(state => state.theme);

    const theme = useMemo(
        () => (themeMode === 'light' ? brandingLightTheme : brandingDarkTheme),
        [brandingDarkTheme, brandingLightTheme, themeMode]
    );

    return theme;
};
