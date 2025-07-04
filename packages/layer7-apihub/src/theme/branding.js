// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { useState, useEffect } from 'react';
import merge from 'lodash/fp/merge';
import { createTheme } from '@mui/material/styles';
import get from 'lodash/get';
import { deepmerge } from '@mui/utils';

import { theme } from './theme';
import { isOrgBoundUser } from '../userContexts';
import { getFetchJson } from '../fetchUtils';

const LOGGED_IN = '@layer7/authentication/loggedIn';

const defaultMuiTheme = createTheme();
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
        error: {
            light: color.apiHubPrimary,
            main: color.apiHubPrimary,
            dark: color.apiHubPrimary,
            contrastText: '',
        },
    };
    const mergedPalette = deepmerge(defaultMuiTheme.palette, palette);
    return {
        mergedPalette,
        components: {
            RaMenuItemLink: {
                styleOverrides: {
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
            },
            RaSidebar: {
                styleOverrides: {
                    root: {
                        '& .MuiPaper-root': {
                            backgroundColor: palette.secondary.main,
                            marginTop: '0.5em',
                            height: 'calc(100% - 0.5em)',
                        },
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        textTransform: 'capitalize',
                        '&.Mui-selected': {
                            color: palette.primary.main,
                            fontWeight: theme.typography.fontWeightBold,
                        },
                    },
                },
            },
        },
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
    };
};

export const fetchBranding = async (url, originHubName, userContext) => {
    const fetchJson = getFetchJson(originHubName);
    // Pass a orgId to fetch org based theme
    const options = {};
    const isOrgUser = userContext ? isOrgBoundUser(userContext) : false;
    if (isOrgUser) {
        const orgUuid = get(userContext, 'userDetails.organizationUuid');
        options.headers = new Headers({ Accept: 'application/json' });
        options.headers.set('APIM-OrgUuid', orgUuid);
    }
    const { json } = await fetchJson(`${url}/branding/1.0/themes`, options);
    return json;
};

export const fetchUserContext = async (url, originHubName) => {
    const fetchJson = getFetchJson(originHubName);
    const { json } = await fetchJson(`${url}/userContexts`);
    return json;
};

export const useBranding = (url, originHubName, defaultTheme = theme) => {
    const [brandingTheme, setBrandingTheme] = useState(defaultTheme);
    const [brandingLogo, setBrandingLogo] = useState(null);
    const [brandingFavicon, setBrandingFavicon] = useState(null);
    const [userContext, setUserContext] = useState('');

    useEffect(() => {
        if (JSON.parse(sessionStorage.getItem(LOGGED_IN))) {
            fetchUserContext(url, originHubName).then(response => {
                setUserContext(get(response, 'userContexts[0]'));
            });
        }
    }, [originHubName, url]);

    useEffect(() => {
        fetchBranding(url, originHubName, userContext)
            .then(theme => {
                localStorage.setItem(
                    'SHOW_COPYRIGHT',
                    get(theme, 'display.apihubCopyright')
                );
                return {
                    logo: theme.logo,
                    favicon: theme.favicon,
                    ...createTheme(convertBrandingToMuiTheme(theme)),
                };
            })
            .then(({ logo, favicon, ...theme }) => {
                if (global.APIHUB_CONFIG.USE_BRANDING_THEME) {
                    setBrandingLogo(logo);
                    setBrandingFavicon(favicon);
                    setBrandingTheme(merge(defaultTheme, theme));
                } else {
                    setBrandingLogo(null);
                    setBrandingFavicon(null);
                    setBrandingTheme(defaultTheme);
                }
            });
    }, [defaultTheme, originHubName, url, userContext]);

    return {
        logo: brandingLogo,
        favicon: brandingFavicon,
        theme: brandingTheme,
    };
};
