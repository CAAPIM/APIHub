import React from 'react';
import { makeStyles } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { theme as defaultTheme } from '../theme';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    columns: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(4),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(3),
        },
        '&:first-child': {
            minWidth: '250px',
            maxWidth: '30%',
            [theme.breakpoints.down('sm')]: {
                maxWidth: '100%',
                width: '100%',
            },
        },
        '&:not(:first-child)': {
            borderStyle: 'solid',
            borderColor: theme.palette.divider,
            borderWidth: '0px 0px 0px 1px',
            marginLeft: theme.spacing(4),
            maxWidth: `calc(50% - ${theme.spacing(4)}px)`,
            [theme.breakpoints.down('sm')]: {
                borderWidth: '1px 0px 0px 0px',
                marginLeft: '0px',
                maxWidth: '100%',
                width: '100%',
            },
        },
        '&:last-child': {
            flexGrow: 1,
        },
    },
}));

// This component exists for theming only. Indeed, we must call the useStyles hook AFTER
// the ThemeProvider has been initialized with the specified theme
const ThemedAuthenticationLayout = ({ children, Header, Content, Footer }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {Header ? <Header /> : null}
            <div className={classes.container}>
                <div className={classes.columns}>{children}</div>
                {Content ? (
                    <div className={classes.columns}>
                        <Content />
                    </div>
                ) : null}
            </div>
            {Footer ? <Footer /> : null}
        </div>
    );
};
/**
 * The page displaying the account setup form
 *
 * @param {*} Header A React Component used as the page header
 * @param {*} Content A React Component used to display some content next to the account setup form
 * @param {*} Footer A React Component used as the page footer
 *
 * @example <caption>Simple usage</caption>
 * <AccountSetupPage />
 *
 * const MyApp = props => <Admin accountSetupPage={MyAccountSetupPage} {...props} />
 *
 * @example <caption>With customized parts</caption>
 * const Header = () => <header><h1>My company</h1></header>
 * const Content = () => <section><p>Welcome to My Product.</p></section>
 * const Footer = () => <footer>Copyright © 2020 My Company. All Rights Reserved</footer>
 *
 * const AccountSetupPagePage = props => (
 *     <AccountSetupPage
 *         Header={CustomHeader}
 *         Content={CustomContent}
 *         Footer={CustomFooter}
 *         {...props}
 *     />
 * );
 *
 * const MyApp = props => <Admin accountSetupPage={MyAccountSetupPage} {...props} />
 */
export const AuthenticationLayout = ({ theme = defaultTheme, ...props }) => {
    return (
        <ThemeProvider theme={createMuiTheme(theme)}>
            <ThemedAuthenticationLayout {...props} />
        </ThemeProvider>
    );
};
