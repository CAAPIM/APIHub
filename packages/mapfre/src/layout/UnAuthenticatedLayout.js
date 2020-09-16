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
import illustration from './mapfre_main.jpg';

export const UnAuthenticatedLayout = ({ children, showActions }) => {
    const classes = useStyles();

    return (
        <>
            <Header showActions={showActions} />
            {showActions ? (
                <img
                    src={illustration}
                    alt="Mapfre's Mechanich"
                    className={classes.illustration}
                />
            ) : null}
            <Container className={classes.root} maxWidth="lg">
                <main className={classes.main}>{children}</main>
                <Notification />
            </Container>
            <Footer />
        </>
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
        illustration: {
            height: '100%',
            width: '100%',
        },
    }),
    {
        name: 'HealthcareUnAuthenticatedLayout',
    }
);
