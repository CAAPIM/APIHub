import React from 'react';
import {
    createMuiTheme,
    makeStyles,
    ThemeProvider,
    CssBaseline,
} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { Notification } from 'react-admin';

import { theme } from '../theme';
import { Footer } from './Footer';
import { Header } from './Header';

export const UnAuthenticatedLayout = ({ children, showActions }) => {
    const classes = useStyles();

    return (
        <Container className={classes.root} maxWidth="lg">
            <Header showActions={showActions} />
            <main className={classes.main}>{children}</main>
            <Footer />
            <Notification />
        </Container>
    );
};

export const UnAuthenticatedLayoutWithTheme = props => {
    return (
        <ThemeProvider theme={createMuiTheme(theme)}>
            <CssBaseline />
            <UnAuthenticatedLayout {...props} />
        </ThemeProvider>
    );
};

const useStyles = makeStyles(
    theme => ({
        '@global': {
            body: {
                //original: `linear-gradient(90deg, rgba(116,255,51,0) 0%, rgba(80,55,0,1) 42%);`
                background: '#ffffff',
                color: theme.palette.common.white,
            },
            '#root': {
                minHeight: '100vh',
            },
        },
        root: {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
        },
        main: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
        },
    }),
    {
        name: 'HealthcareUnAuthenticatedLayout',
    }
);
