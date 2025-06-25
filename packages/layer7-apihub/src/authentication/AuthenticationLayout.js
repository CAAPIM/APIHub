// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { makeStyles } from 'tss-react/mui';
import {
    ThemeProvider,
    StyledEngineProvider,
    createTheme,
} from '@mui/material/styles';
import { Notification } from 'react-admin';

import { theme as defaultTheme } from '../theme';

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
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={createTheme(theme)}>
                <ThemedAuthenticationLayout {...props} />
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

// This component exists for theming only. Indeed, we must call the useStyles hook AFTER
// the ThemeProvider has been initialized with the specified theme
const ThemedAuthenticationLayout = ({
    children,
    Header,
    Content,
    Footer,
    ...rest
}) => {
    const { classes } = useStyles();
    return (
        <div className={classes.root}>
            {Header ? <Header /> : null}
            <main className={classes.container}>
                <div className={classes.columns}>{children}</div>
                {Content ? (
                    <div className={classes.columns}>
                        <Content />
                    </div>
                ) : null}
            </main>
            {Footer ? <Footer /> : null}
            <Notification />
        </div>
    );
};

const useStyles = makeStyles({ name: 'Layer7ThemedAuthenticationLayout' })(
    theme => ({
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
            flexGrow: 1,
        },
        columns: {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(4),
            [theme.breakpoints.down('md')]: {
                padding: theme.spacing(3),
            },
            '&:first-child': {
                minWidth: '250px',
                maxWidth: '30%',
                [theme.breakpoints.down('md')]: {
                    maxWidth: '100%',
                    width: '100%',
                },
            },
            '&:not(:first-child)': {
                borderStyle: 'solid',
                borderColor: theme.palette.divider,
                borderWidth: '0px 0px 0px 1px',
                marginLeft: theme.spacing(4),
                maxWidth: `calc(50% - ${theme.spacing(4)})`,
                [theme.breakpoints.down('md')]: {
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
    })
);
