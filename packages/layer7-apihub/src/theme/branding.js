import { useState, useEffect } from 'react';
import merge from 'lodash/fp/merge';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import { theme } from './theme';
import { getFetchJson } from '../fetchUtils';

const convertBrandingToMuiTheme = themeBranding => {
    const { color, typography } = themeBranding;
    const palette = {
        primary: {
            light: color.primaryButtonBackground,
            main: color.primaryButtonBackground,
            dark: color.primaryButtonBackground,
            contrastText: '',
        },
        secondary: {
            light: color.footerBackground,
            main: color.footerBackground,
            dark: color.footerBackground,
            contrastText: '',
        },
        action: {
            active: color.link,
            hover: color.linkHover,
        },
        background: {
            default: color.background,
        },
    };

    return {
        palette,
        typography: {
            fontFamily: typography.bodyText,
            h1: {
                fontFamily: typography.pageTitle,
            },
            h2: {
                fontFamily: typography.pageTitle,
            },
            h3: {
                fontFamily: typography.pageTitle,
            },
            h4: {
                fontFamily: typography.pageTitle,
            },
            h5: {
                fontFamily: typography.pageTitle,
            },
            h6: {
                fontFamily: typography.pageTitle,
            },
            subtitle1: {
                fontFamily: typography.bodyText,
            },
            subtitle2: {
                fontFamily: typography.smallText,
            },
            body1: {
                fontFamily: typography.bodyText,
            },
            body2: {
                fontFamily: typography.smallText,
            },
            button: {
                fontFamily: typography.buttonText,
            },
        },
        overrides: {
            RaSidebar: {
                drawerPaper: {
                    backgroundColor: palette.secondary.main,
                    marginTop: '1.5em',
                    height: 'calc(100% - 1.5em)',
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
    const { json } = await fetchJson(`${url}/api/apim/branding/1.0/themes`);
    return json;
};

export const useBranding = (url, originHubName, defaultTheme = theme) => {
    const [brandingTheme, setBrandingTheme] = useState(defaultTheme);
    const [brandingLogo, setBrandingLogo] = useState('');
    const [brandingFavicon, setBrandingFavicon] = useState('');

    useEffect(() => {
        if (!url) {
            return;
        }
        fetchBranding(url, originHubName)
            .then(theme => {
                return createMuiTheme(convertBrandingToMuiTheme(theme));
            })
            .then(({ logo, favicon, ...theme }) => {
                setBrandingLogo(logo);
                setBrandingFavicon(favicon);
                setBrandingTheme(merge(defaultTheme, theme));
            });
    }, [defaultTheme, originHubName, url]);

    return {
        logo: brandingLogo,
        favicon: brandingFavicon,
        theme: brandingTheme,
    };
};
