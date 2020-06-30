import { defaultTheme } from 'react-admin';
import defaultMuiTheme from '@material-ui/core/styles/defaultTheme';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import createPalette from '@material-ui/core/styles/createPalette';
import merge from 'lodash/merge';

import blue from '@material-ui/core/colors/blue';

const palette = createPalette(
    merge({}, defaultTheme.palette, {
        secondary: {
            light: '#6ec6ff',
            main: '#43425d',
            dark: '#0069c0',
            contrastText: defaultMuiTheme.palette.common.white,
        },
    })
);

/**
 * Default Layer 7 Api Hub theme
 */
export const theme = createMuiTheme(
    merge({}, defaultTheme, {
        palette,
        overrides: {
            RaMenuItemLink: {
                root: {
                    color: palette.common.white,
                    borderLeftColor: 'transparent',
                    borderLeftWidth: defaultMuiTheme.spacing(0.5),
                    borderLeftStyle: 'solid',
                    paddingTop: defaultMuiTheme.spacing(2),
                    paddingBottom: defaultMuiTheme.spacing(2),
                },
                active: {
                    borderLeftColor: blue[800],
                    borderLeftWidth: defaultMuiTheme.spacing(0.5),
                    borderLeftStyle: 'solid',
                    backgroundColor: palette.action.selected,
                    color: palette.common.white,
                    '& svg': {
                        color: '#a3a0fb',
                    },
                },
                icon: {
                    color: palette.common.white,
                },
            },
            RaSidebar: {
                drawerPaper: {
                    backgroundColor: palette.secondary.main,
                    marginTop: '1.5em',
                    height: 'calc(100% - 1.5em)',
                },
            },
            RaLayout: {
                root: {
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 1,
                    minHeight: '100vh',
                    position: 'relative',
                    minWidth: 'fit-content',
                    width: '100%',
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
                content: {
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
            MuiTab: {
                root: {
                    textTransform: 'capitalize',
                    '&$selected': {
                        color: palette.primary,
                        fontWeight: defaultMuiTheme.typography.fontWeightBold,
                    },
                },
            },
        },
        props: {
            MuiFab: {
                color: 'primary',
            },
        },
    })
);
