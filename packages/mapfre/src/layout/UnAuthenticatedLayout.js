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
                background: `linear-gradient(90deg, rgba(192,37,36,1) 0%, rgba(190,37,36,0.7903536414565826) 42%);
            `,
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
