import defaultMuiTheme from '@material-ui/core/styles/defaultTheme';
import { theme as defaultTheme } from 'layer7-apihub';
import merge from 'lodash/merge';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import createPalette from '@material-ui/core/styles/createPalette';

const palette = createPalette(
    merge({}, defaultTheme.palette, {
        secondary: {
            //Cambia el color de algunos botones e indicadores de posición.Original: #43425d
            main: '#43425d',
            //No se percibe ningún cambio. Original: #ae418e
            light: '#ae418e',
            //Original:
            dark: '#c02524',
        },
        primary: {
            main: '#10054d',
            light: '#0b0335',
            dark: '#3f3770',
        },
        background: {
            default: '#e7e6ed',
            darker: '#c02524',
        },
        type: 'light',
        colorContrast: '#ffffff',
    })
);

export const theme = createMuiTheme(
    merge({}, defaultTheme, {
        typography: {
            fontFamily: 'Open Sans',
            h1: {
                fontWeight: '900',
                textTransform: 'uppercase',
            },
            h2: {
                fontWeight: '900',
                textTransform: 'uppercase',
                fontSize: '3rem',
            },
            h3: {
                fontWeight: '700',
                fontSize: '2.75rem',
            },
            h4: {
                fontWeight: '700',
            },
            h5: {
                fontWeight: '500',
            },
            h6: {
                fontWeight: '500',
            },
            subtitle1: {
                color: palette.grey[700],
            },
            subtitle2: {
                color: palette.grey[500],
            },
            body1: {
                fontSize: '0.9rem',
            },
        },
        palette,
        overrides: {
            // Material-UI

            MuiCssBaseline: {
                '@global': {
                    '@font-face': 'Open Sans',
                    color: palette.primary.main,
                },
            },
            MuiAppBar: {
                root: {
                    paddingTop: defaultMuiTheme.spacing(1),
                    paddingBottom: defaultMuiTheme.spacing(1),
                    background: `linear-gradient(127deg, #c02524, #c02524);`,
                },
            },
            MuiCard: {
                root: {
                    borderRadius: 0,
                    border: 'none',
                },
            },
            MuiTabs: {
                flexContainer: {
                    justifyContent: 'flex-end',
                },
                indicator: {
                    backgroundColor: palette.secondary.main,
                },
            },
            MuiTab: {
                root: {
                    fontWeight: defaultMuiTheme.typography.fontWeightBold,
                    textTransform: 'uppercase',
                    paddingBottom: defaultMuiTheme.spacing(4),
                    paddingTop: defaultMuiTheme.spacing(4),
                    '&$selected:': {
                        color: palette.primary.main,
                        fontWeight: defaultMuiTheme.typography.fontWeightBold,
                    },
                },
            },
            MuiButton: {
                root: {
                    color: palette.primary.main,
                    paddingTop: defaultMuiTheme.spacing(1),
                    paddingRight: defaultMuiTheme.spacing(4),
                    paddingBottom: defaultMuiTheme.spacing(1),
                    paddingLeft: defaultMuiTheme.spacing(4),
                    borderRadius: defaultMuiTheme.spacing(4),
                    textTransform: 'uppercase',
                    fontWeight: defaultMuiTheme.typography.fontWeightBold,
                },
                sizeSmall: {
                    paddingTop: defaultMuiTheme.spacing(0),
                    paddingRight: defaultMuiTheme.spacing(2),
                    paddingBottom: defaultMuiTheme.spacing(0),
                    paddingLeft: defaultMuiTheme.spacing(2),
                    borderRadius: defaultMuiTheme.spacing(2),
                },
                sizeLarge: {
                    paddingTop: defaultMuiTheme.spacing(2),
                    paddingRight: defaultMuiTheme.spacing(6),
                    paddingBottom: defaultMuiTheme.spacing(2),
                    paddingLeft: defaultMuiTheme.spacing(6),
                    borderRadius: defaultMuiTheme.spacing(6),
                },
                contained: {
                    boxShadow: 'none',
                    textTransform: 'unset',
                },
                containedPrimary: {
                    color: palette.common.white,
                    backgroundColor: palette.primary.main,
                },
                containedSecondary: {
                    color: palette.common.white,
                    backgroundColor: palette.secondary.main,
                },
                outlined: {
                    textTransform: 'unset',
                },
                outlinedPrimary: {
                    color: palette.primary.main,
                    borderColor: palette.primary.main,
                },
                outlinedSecondary: {
                    color: palette.common.white,
                    borderColor: palette.common.white,
                },
                text: {},
                textPrimary: {
                    color: palette.primary.main,
                },
                textSecondary: {
                    color: palette.secondary.main,
                },
                label: {},
            },
            MuiLink: {
                root: {
                    cursor: 'pointer',
                },
            },
            MuiTreeView: {
                root: {
                    padding: defaultMuiTheme.spacing(1),
                    '& svg': {
                        fill: palette.secondary.main,
                    },
                },
            },
            MuiTablePagination: {
                root: {
                    '& .previous-page': {
                        color: palette.common.white,
                        backgroundColor: palette.primary.main,
                        padding: defaultMuiTheme.spacing(1, 2, 1, 1),
                    },
                    '& .next-page': {
                        color: palette.common.white,
                        backgroundColor: palette.primary.main,
                        padding: defaultMuiTheme.spacing(1, 1, 1, 2),
                    },
                },
                selectRoot: {
                    borderStyle: 'solid',
                    borderWidth: '2px',
                    borderColor: palette.grey[300],
                    borderRadius: defaultMuiTheme.shape.borderRadius,
                    textTransform: 'uppercase',
                    fontWeight: defaultMuiTheme.typography.fontWeightBold,
                    color: palette.primary.main,
                    paddingLeft: defaultMuiTheme.spacing(2),
                    paddingRight: defaultMuiTheme.spacing(2),
                    paddingTop: defaultMuiTheme.spacing(1),
                    paddingBottom: defaultMuiTheme.spacing(1),
                },
                toolbar: {
                    marginTop: defaultMuiTheme.spacing(2),
                    marginBottom: defaultMuiTheme.spacing(2),
                },
                spacer: {},
                caption: {},
            },

            // React-Admin

            RaSidebar: {
                drawerPaper: {
                    backgroundColor: palette.common.white,
                    color: palette.primary.main,
                    marginTop: '0.5rem !important',
                    height: `calc(100% - 0.5rem)`,
                    boxShadow: `2px 0px 1px -1px rgba(0,0,0,0.2),
                1px 0px 3px 0px rgba(0,0,0,0.1)`,
                },
            },
            RaMenuItemLink: {
                root: {
                    color: palette.primary.main,
                    fontWeight: defaultMuiTheme.typography.fontWeightBold,
                },
                active: {
                    borderLeftStyle: 'none',
                    borderRightColor: palette.secondary.main,
                    borderRightWidth: defaultMuiTheme.spacing(0.5),
                    borderRightStyle: 'solid',
                    backgroundColor: palette.action.selected,
                    color: palette.primary.main,
                    '& svg': {
                        color: palette.primary.main,
                    },
                },
                icon: {
                    color: palette.primary.main,
                },
            },
            RaLayout: {
                contentWithSidebar: {
                    marginTop: defaultMuiTheme.spacing(4),
                },
                content: {
                    height: 'auto',
                    backgroundColor: palette.background.default,
                    paddingTop: defaultMuiTheme.spacing(0),
                    paddingRight: defaultMuiTheme.spacing(0),
                    paddingBottom: defaultMuiTheme.spacing(0),
                    paddingLeft: defaultMuiTheme.spacing(0),
                    display: 'flex',
                    flexDirection: 'column',
                    [defaultMuiTheme.breakpoints.up('xs')]: {
                        paddingTop: defaultMuiTheme.spacing(0),
                        paddingRight: defaultMuiTheme.spacing(0),
                        paddingBottom: defaultMuiTheme.spacing(0),
                        paddingLeft: defaultMuiTheme.spacing(0),
                    },
                    '& > div, & > h2': {
                        paddingTop: defaultMuiTheme.spacing(4),
                        paddingRight: defaultMuiTheme.spacing(3),
                        paddingBottom: defaultMuiTheme.spacing(3),
                        paddingLeft: defaultMuiTheme.spacing(3),
                        [defaultMuiTheme.breakpoints.up('xs')]: {
                            paddingLeft: defaultMuiTheme.spacing(6),
                        },
                    },
                },
            },
            RaTabbedShowLayout: {
                content: {
                    borderRadius: defaultMuiTheme.shape.borderRadius,
                    marginTop: defaultMuiTheme.spacing(4),
                    backgroundColor: palette.common.white,
                    boxShadow: defaultMuiTheme.shadows[3],
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                },
            },
            RaShow: {
                main: {
                    marginTop: defaultMuiTheme.spacing(2),
                },
                noActions: {
                    marginTop: defaultMuiTheme.spacing(2),
                },
            },
            RaFilter: {
                form: {},
                button: {
                    '& button': {
                        borderStyle: 'solid',
                        borderWidth: '2px',
                        borderColor: palette.grey[300],
                        borderRadius: defaultMuiTheme.shape.borderRadius,
                        textTransform: 'uppercase',
                        fontWeight: defaultMuiTheme.typography.fontWeightBold,
                        color: palette.primary.main,
                        paddingLeft: defaultMuiTheme.spacing(2),
                        paddingRight: defaultMuiTheme.spacing(2),
                        paddingTop: defaultMuiTheme.spacing(1),
                        paddingBottom: defaultMuiTheme.spacing(1),
                    },
                },
            },
            RaListToolbar: {
                toolbar: {
                    paddingBottom: defaultMuiTheme.spacing(1),
                    borderBottomStyle: 'solid',
                    borderBottomWidth: '1px',
                    borderBottomColor: palette.grey[300],
                    marginBottom: defaultMuiTheme.spacing(2),
                },
                actions: {
                    marginRight: '0px',
                },
            },

            // Layer7 ApiHub

            Layer7CardGrid: {
                root: {
                    marginTop: '0px',
                    marginRight: '0px',
                    marginBottom: '0px',
                    marginLeft: '0px',
                },
            },
            Layer7ViewTitle: {
                root: {
                    marginTop: '0px',
                    marginBottom: '0px',
                    flexGrow: 0,
                    flexShrink: 0,
                },
                title: {
                    fontSize: '2rem',
                    fontWeight: '300',
                },
            },
            Layer7AccountSetupForm: {
                root: {}, // Don't override the root to have a great toolbar style
                title: {
                    color: palette.primary.main,
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    textTransform: 'unset',
                    marginBottom: defaultMuiTheme.spacing(4),
                },
                form: {
                    '& >:first-child': {
                        paddingTop: defaultMuiTheme.spacing(0),
                        paddingBottom: defaultMuiTheme.spacing(0),
                    },
                },
            },
            Layer7AccountSetupInvalidRequest: {
                root: {},
                title: {
                    color: palette.primary.main,
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    textTransform: 'unset',
                    marginBottom: defaultMuiTheme.spacing(4),
                },
            },
            Layer7AccountSetupPreparingForm: {
                root: {},
                title: {
                    color: palette.primary.main,
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    textTransform: 'unset',
                    marginBottom: defaultMuiTheme.spacing(4),
                },
            },
            Layer7AccountSetupSuccess: {
                root: {},
                title: {
                    color: palette.primary.main,
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    textTransform: 'unset',
                    marginBottom: defaultMuiTheme.spacing(4),
                },
            },
            Layer7AccountSetupToolbar: {
                toolbar: {
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    padding: defaultMuiTheme.spacing(6, 4),
                    flexBasis: 0,
                    flexGrow: 0,
                },
                error: {
                    padding: defaultMuiTheme.spacing(2, 4),
                },
                success: {
                    padding: defaultMuiTheme.spacing(2, 4),
                },
                submit: {},
            },
            Layer7NewPasswordForm: {
                root: {}, // Don't override the root to have a great toolbar style
                title: {
                    color: palette.primary.main,
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    textTransform: 'unset',
                    marginBottom: defaultMuiTheme.spacing(4),
                },
                form: {
                    '& >:first-child': {
                        paddingTop: defaultMuiTheme.spacing(0),
                        paddingBottom: defaultMuiTheme.spacing(0),
                    },
                },
            },
            Layer7NewPasswordInvalidToken: {
                root: {},
                title: {
                    color: palette.primary.main,
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    textTransform: 'unset',
                    marginBottom: defaultMuiTheme.spacing(4),
                },
            },
            Layer7NewPasswordSuccess: {
                root: {},
                title: {
                    color: palette.primary.main,
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    textTransform: 'unset',
                    marginBottom: defaultMuiTheme.spacing(4),
                },
            },
            Layer7NewPasswordVerifyingToken: {
                root: {},
                title: {
                    color: palette.primary.main,
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    textTransform: 'unset',
                    marginBottom: defaultMuiTheme.spacing(4),
                },
            },
            Layer7NewPasswordToolbar: {
                toolbar: {
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    flexBasis: 0,
                    flexGrow: 0,
                },
                error: {
                    padding: defaultMuiTheme.spacing(2, 4),
                },
                success: {
                    padding: defaultMuiTheme.spacing(2, 4),
                },
                submit: {},
            },
            Layer7ResetPasswordForm: {
                root: {}, // Don't override the root to have a great toolbar style
                title: {
                    color: palette.primary.main,
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    textTransform: 'unset',
                    marginBottom: defaultMuiTheme.spacing(4),
                },
                form: {
                    display: 'flex',
                    flexDirection: 'column',
                    '& >:first-child': {
                        paddingTop: defaultMuiTheme.spacing(0),
                        paddingBottom: defaultMuiTheme.spacing(0),
                        flexGrow: 1,
                    },
                },
            },
            Layer7ResetPasswordConfirm: {
                root: {},
                title: {
                    color: palette.primary.main,
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    textTransform: 'unset',
                    marginBottom: defaultMuiTheme.spacing(4),
                },
            },
            Layer7ResetPasswordToolbar: {
                toolbar: {
                    display: 'flex',
                    alignItems: 'flex-end',
                    flexGrow: 0,
                    justifyContent: 'center',
                    flexBasis: 0,
                },
                error: {
                    padding: defaultMuiTheme.spacing(2, 4),
                },
                success: {
                    padding: defaultMuiTheme.spacing(2, 4),
                },
            },
            Layer7ApiShow: {
                root: {
                    position: 'relative',
                    '& #react-admin-title': {
                        position: 'absolute',
                        marginTop: 50,
                    },
                },
                card: {
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                },
            },
            Layer7ApiOverview: {
                informations: {
                    '&.MuiGrid-item': {
                        backgroundColor: palette.background.darker,
                        paddingTop: defaultMuiTheme.spacing(2),
                        paddingBottom: defaultMuiTheme.spacing(2),
                        paddingLeft: defaultMuiTheme.spacing(4),
                        paddingRight: defaultMuiTheme.spacing(4),
                    },
                    '& label': {
                        color: palette.colorContrast,
                        fontSize: '1rem',
                    },
                    '& label ~ div': {
                        fontWeight: defaultMuiTheme.typography.fontWeightBold,
                        color: palette.colorContrast,
                        padding: defaultMuiTheme.spacing(0),
                    },
                },
                applications: {
                    '&.MuiGrid-item': {
                        backgroundColor: palette.background.darker,
                        paddingTop: defaultMuiTheme.spacing(2),
                        paddingBottom: defaultMuiTheme.spacing(2),
                        paddingLeft: defaultMuiTheme.spacing(4),
                        paddingRight: defaultMuiTheme.spacing(4),
                    },
                    '& label': {
                        color: palette.colorContrast,
                        fontSize: '1rem',
                    },
                    '& label ~ div': {
                        fontWeight: defaultMuiTheme.typography.fontWeightBold,
                        color: palette.colorContrast,
                        padding: defaultMuiTheme.spacing(0),
                    },
                },
                description: {
                    '&.MuiGrid-item': {
                        paddingTop: defaultMuiTheme.spacing(2),
                        paddingBottom: defaultMuiTheme.spacing(2),
                        paddingLeft: defaultMuiTheme.spacing(4),
                        paddingRight: defaultMuiTheme.spacing(4),
                    },
                    '& label': {
                        color: palette.primary.main,
                        fontWeight: 'normal',
                        marginTop: defaultMuiTheme.spacing(2),
                        marginBottom: defaultMuiTheme.spacing(1),
                    },
                },
                assets: {
                    '&.MuiGrid-item': {
                        backgroundColor: palette.grey[100],
                        paddingTop: defaultMuiTheme.spacing(2),
                        paddingBottom: defaultMuiTheme.spacing(2),
                        paddingLeft: defaultMuiTheme.spacing(4),
                        paddingRight: defaultMuiTheme.spacing(4),
                    },
                    '& label': {
                        color: palette.primary.main,
                        fontWeight: 'normal',
                        marginTop: defaultMuiTheme.spacing(2),
                        marginBottom: defaultMuiTheme.spacing(1),
                    },
                    '& li': {
                        '&::before': {
                            content: "'• '",
                            marginRight: defaultMuiTheme.spacing(1),
                            fontSize: '1rem',
                            color: palette.secondary.main,
                        },
                    },
                },
            },
            Layer7ApplicationOverviewField: {
                editButton: {
                    top: '-35px', // Align the button with the field label
                },
            },
            Layer7ApplicationKeyClient: {
                field: {
                    width: `calc(100% - ${defaultMuiTheme.spacing(2)}px)`,
                },
                fieldContent: {
                    backgroundColor: palette.background.darker,
                    padding: defaultMuiTheme.spacing(1, 1, 1, 2),
                    borderRadius: defaultMuiTheme.shape.borderRadius,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                },
            },
            Layer7ApplicationKeySecret: {
                field: {
                    width: `calc(100% - ${defaultMuiTheme.spacing(2)}px)`,
                },
                fieldContent: {
                    backgroundColor: palette.background.darker,
                    padding: defaultMuiTheme.spacing(1, 1, 1, 2),
                    borderRadius: defaultMuiTheme.shape.borderRadius,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                },
                buttonGenerate: {},
                selectField: {
                    color: palette.primary.main,
                    backgroundColor: 'transparent',
                    border: `1px solid ${palette.primary.main}`,
                    padding: defaultMuiTheme.spacing(1, 2),
                    fontWeight: defaultMuiTheme.typography.fontWeightBold,
                    borderRadius: defaultMuiTheme.spacing(4),
                    '&.MuiNativeSelect-select:focus, .MuiNativeSelect-select': {
                        borderRadius: 'unset',
                    },
                    '&.MuiInput-underline:after, .MuiInput-underline:before': {
                        borderBottom: 0,
                    },
                    '&.MuiInput-underline:before': {
                        borderBottom: 0,
                    },
                    '&.MuiInput-underline:hover:not(.Mui-disabled):before': {
                        borderBottom: 0,
                    },
                    '& .MuiNativeSelect-icon': {
                        fill: palette.primary.main,
                    },
                },
            },
            Layer7HomePageButton: {
                root: {
                    position: 'fixed',
                    right: defaultMuiTheme.spacing(6),
                    top: `calc(${defaultMuiTheme.spacing(
                        11
                    )}px + ${defaultMuiTheme.spacing(6)}px)`,
                },
            },
            Layer7DocumentList: {
                root: {
                    marginTop: defaultMuiTheme.spacing(4),
                    padding: defaultMuiTheme.spacing(0),
                },
            },
            Layer7Documentation: {
                root: {},
                treeContainer: {
                    padding: 0,
                    paddingRight: 0,
                    marginTop: 0,
                    marginBottom: 0,
                    backgroundColor: palette.grey[100],
                },
                treeToolbar: {
                    padding: defaultMuiTheme.spacing(1),
                    backgroundColor: palette.grey[300],
                    alignItems: 'flex-end',
                },
                localeButton: {
                    borderStyle: 'solid',
                    borderWidth: '2px',
                    borderColor: palette.grey[400],
                    textTransform: 'uppercase',
                    fontWeight: defaultMuiTheme.typography.fontWeightBold,
                    color: palette.primary.main,
                    paddingTop: defaultMuiTheme.spacing(1),
                    paddingBottom: defaultMuiTheme.spacing(1),
                    alignItems: 'center',
                },
                addRootDocumentationButton: {
                    marginBottom: defaultMuiTheme.spacing(1),
                },
            },
            Layer7ApiListActions: {
                root: {
                    '& button': {
                        borderStyle: 'solid',
                        borderWidth: '2px',
                        borderColor: palette.grey[300],
                        textTransform: 'uppercase',
                        fontWeight: defaultMuiTheme.typography.fontWeightBold,
                        color: palette.primary.main,
                        paddingLeft: defaultMuiTheme.spacing(2),
                        paddingRight: defaultMuiTheme.spacing(2),
                        paddingTop: defaultMuiTheme.spacing(1),
                        paddingBottom: defaultMuiTheme.spacing(1),
                    },
                },
            },
            Layer7ApiCard: {
                root: {
                    borderRadius: defaultMuiTheme.shape.borderRadius,
                    position: 'relative',
                    '& svg': {
                        fill: palette.secondary.dark,
                    },
                },
                header: {
                    padding: 0,
                    height: '140px',
                },
                title: {
                    color: palette.colorContrast,
                    backgroundColor: palette.background.darker,
                    padding: defaultMuiTheme.spacing(4, 2),
                },
                subheader: {
                    height: `calc(60px - ${defaultMuiTheme.spacing(5)}px)`, // height - paddingTop - paddingBottom
                    padding: defaultMuiTheme.spacing(3, 2, 2, 2),
                    '& span': {
                        color: palette.primary.main,
                        fontWeight: defaultMuiTheme.typography.fontWeightBold,
                    },
                },
                tags: {
                    borderBottomStyle: 'solid',
                    borderBottomWidth: '1px',
                    borderBottomColor: palette.grey[300],
                    borderTopStyle: 'none',
                    paddingTop: 0,
                    paddingBottom: defaultMuiTheme.spacing(2),
                    marginBottom: defaultMuiTheme.spacing(2),
                },
                stats: {
                    paddingTop: defaultMuiTheme.spacing(1),
                    paddingBottom: defaultMuiTheme.spacing(1),
                    '& span': {
                        color: palette.primary.main,
                        fontWeight: defaultMuiTheme.typography.fontWeightBold,
                    },
                },
            },
            Layer7ApiStatus: {
                status: {
                    color: palette.primary.main,
                    fontWeight: defaultMuiTheme.typography.fontWeightBold,
                    textTransform: 'uppercase',
                },
            },
            Layer7ApplicationCard: {
                root: {
                    borderRadius: defaultMuiTheme.shape.borderRadius,
                    position: 'relative',
                    '& svg': {
                        fill: palette.secondary.dark,
                    },
                },
                header: {
                    padding: 0,
                    height: '140px',
                },
                title: {
                    color: palette.primary.main,
                    backgroundColor: palette.background.darker,
                    padding: defaultMuiTheme.spacing(4, 2),
                },
                subheader: {
                    height: `calc(60px - ${defaultMuiTheme.spacing(5)}px)`, // height - paddingTop - paddingBottom
                    padding: defaultMuiTheme.spacing(3, 2, 2, 2),
                    '& span': {
                        color: palette.primary.main,
                        fontWeight: defaultMuiTheme.typography.fontWeightBold,
                    },
                },
            },
            Layer7SortButton: {
                root: {
                    borderStyle: 'solid',
                    borderWidth: '2px',
                    borderColor: palette.grey[300],
                    borderRadius: defaultMuiTheme.shape.borderRadius,
                    textTransform: 'uppercase',
                    fontWeight: defaultMuiTheme.typography.fontWeightBold,
                    color: palette.primary.main,
                    paddingLeft: defaultMuiTheme.spacing(2),
                    paddingRight: defaultMuiTheme.spacing(2),
                    paddingTop: defaultMuiTheme.spacing(1),
                    paddingBottom: defaultMuiTheme.spacing(1),
                },
            },
            Layer7ApiTags: {
                root: {
                    '& .MuiTabs-flexContainer': {
                        justifyContent: 'flex-start',
                    },
                },
            },
        },
        props: {
            MuiFab: {
                color: 'secondary',
            },
        },
    })
);
