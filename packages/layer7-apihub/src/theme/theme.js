// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { createTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { blue } from '@mui/material/colors';

const defaultMuiTheme = createTheme();

const palette = deepmerge(defaultMuiTheme.palette, {
    secondary: {
        light: '#6ec6ff',
        main: '#43425d',
        dark: '#0069c0',
        contrastText: defaultMuiTheme.palette.common.white,
    },
});

/**
 * Default Layer 7 Api Hub theme
 */
export const theme = deepmerge(defaultMuiTheme, {
    palette,
    components: {
        RaMenuItemLink: {
            styleOverrides: {
                root: {
                    color: palette.common.white,
                    borderLeftColor: 'transparent',
                    borderLeftWidth: defaultMuiTheme.spacing(0.5),
                    borderLeftStyle: 'solid',
                    paddingTop: defaultMuiTheme.spacing(2),
                    paddingBottom: defaultMuiTheme.spacing(2),
                    '&.RaMenuItemLink-active': {
                        borderLeftColor: blue[800],
                        borderLeftWidth: defaultMuiTheme.spacing(0.5),
                        borderLeftStyle: 'solid',
                        backgroundColor: palette.action.selected,
                        color: `${palette.common.white} !important`,
                        '& svg': {
                            color: '#a3a0fb',
                        },
                    },
                    '& .RaMenuItemLink-icon': {
                        color: palette.common.white,
                    },
                },
            },
        },
        RaSidebar: {
            styleOverrides: {
                root: {
                    height: 'auto !important',
                    '& .MuiPaper-root': {
                        backgroundColor: palette.secondary.main,
                        marginTop: '1.5em',
                        height: '100%',
                        [defaultMuiTheme.breakpoints.up('xs')]: {
                            marginTop: '0',
                            paddingTop: '1.5em',
                        },
                        [defaultMuiTheme.breakpoints.down('md')]: {
                            marginTop: '0',
                            paddingTop: '1.5em',
                        },
                        '& .RaSidebar-fixed': {
                            width: '100%',
                        },
                    },
                    fixed: {
                        position: 'relative',
                    },
                },
            },
        },
        RaLayout: {
            styleOverrides: {
                root: {
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 1,
                    minHeight: '100vh',
                    position: 'relative',
                    minWidth: 'fit-content',
                    width: '100%',
                    '& .RaLayout-content': {
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        flexBasis: 0,
                        padding: defaultMuiTheme.spacing(3),
                        paddingTop: defaultMuiTheme.spacing(6),
                        paddingLeft: 0,
                        [defaultMuiTheme.breakpoints.up('xs')]: {
                            paddingLeft: defaultMuiTheme.spacing(3),
                        },
                        [defaultMuiTheme.breakpoints.down('sm')]: {
                            padding: 0,
                        },
                    },
                },
                appFrame: {
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',

                    [defaultMuiTheme.breakpoints.up('xs')]: {
                        marginTop: defaultMuiTheme.spacing(6),
                    },
                    [defaultMuiTheme.breakpoints.down('xs')]: {
                        marginTop: defaultMuiTheme.spacing(9),
                    },
                },
                contentWithSidebar: {
                    display: 'flex',
                    flexGrow: 1,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'capitalize',
                    '&.Mui-selected	': {
                        color: palette.primary,
                        fontWeight: defaultMuiTheme.typography.fontWeightBold,
                    },
                },
            },
        },
        MuiFab: {
            defaultProps: {
                color: 'primary',
            },
        },
        MuiIconButton: {
            defaultProps: {
                size: 'large',
            },
        },
        MuiLink: {
            defaultProps: {
                underline: 'hover', // override default prop of 'none' set by MUI 5
            },
        },
    },
});
