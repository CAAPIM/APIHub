import { useState, useEffect } from 'react';
import merge from 'lodash/fp/merge';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import defaultMuiTheme from '@material-ui/core/styles/defaultTheme';

import { theme } from './theme';
import { getFetchJson } from '../fetchUtils';

const convertBrandingToMuiTheme = themeBranding => {
    const { color, typography } = themeBranding;
    const palette = {
        primary: {
            light: color.apiHubPrimary,
            main: color.apiHubPrimary,
            dark: color.apiHubPrimary,
            contrastText: '',
        },
        secondary: {
            light: color.apiHubSecondary,
            main: color.apiHubSecondary,
            dark: color.apiHubSecondary,
            contrastText: '',
        },
        action: {
            active: color.link,
            hover: color.linkHover,
        },
        background: {
            default: color.background,
        },
        customHeader: {
            main: color.headerBackground,
            contrastText: '',
        },
    };

    return {
        palette,
        typography: {
            fontFamily: typography.apiHubFont,
            h1: {
                fontFamily: typography.apiHubFont,
            },
            h2: {
                fontFamily: typography.apiHubFont,
            },
            h3: {
                fontFamily: typography.apiHubFont,
            },
            h4: {
                fontFamily: typography.apiHubFont,
            },
            h5: {
                fontFamily: typography.apiHubFont,
            },
            h6: {
                fontFamily: typography.apiHubFont,
            },
            subtitle1: {
                fontFamily: typography.apiHubFont,
            },
            subtitle2: {
                fontFamily: typography.apiHubFont,
            },
            body1: {
                fontFamily: typography.apiHubFont,
            },
            body2: {
                fontFamily: typography.apiHubFont,
            },
            button: {
                fontFamily: typography.apiHubFont,
            },
        },
        overrides: {
            RaMenuItemLink: {
                root: {
                    color: color.primaryButtonText,
                    fontWeight: defaultMuiTheme.typography.fontWeightBold,
                    '& svg': {
                        color: color.primaryButtonText,
                    },
                },
                active: {
                    color: color.primaryButtonText,
                    borderLeftColor: color.primaryButtonText,
                    '& svg': {
                        color: color.primaryButtonText,
                    },
                },
            },
            RaSidebar: {
                drawerPaper: {
                    backgroundColor: palette.secondary.main,
                    marginTop: '0.5em',
                    height: 'calc(100% - 0.5em)',
                },
            },
            MuiTab: {
                root: {
                    textTransform: 'capitalize',
                    '&$selected': {
                        color: palette.primary.main,
                        fontWeight: theme.typography.fontWeightBold,
                    },
                },
            },
        },
    };
};

export const fetchBranding = async (url, originHubName) => {
    const fetchJson = getFetchJson(originHubName);
    const { json } = await fetchJson(`${url}/branding/1.0/themes`);
    return json;
};

export const useBranding = (url, originHubName, defaultTheme = theme) => {
    const [brandingTheme, setBrandingTheme] = useState(defaultTheme);
    const [brandingLogo, setBrandingLogo] = useState('');
    const [brandingFavicon, setBrandingFavicon] = useState('');
    useEffect(() => {
        if (global.APIHUB_CONFIG.USE_BRANDING_THEME) {
            fetchBranding(url, originHubName)
                .then(theme => {
                    return {
                        logo: theme.logo,
                        favicon: theme.favicon,
                        ...createMuiTheme(convertBrandingToMuiTheme(theme)),
                    };
                })
                .then(({ logo, favicon, ...theme }) => {
                    setBrandingLogo(logo);
                    setBrandingFavicon(favicon);
                    setBrandingTheme(merge(defaultTheme, theme));
                });
        } else {
            setBrandingLogo(null);
            setBrandingFavicon(null);
            setBrandingTheme(defaultTheme);
        }
    }, [defaultTheme, originHubName, url]);

    return {
        logo: brandingLogo,
        favicon: brandingFavicon,
        theme: brandingTheme,
    };
};
