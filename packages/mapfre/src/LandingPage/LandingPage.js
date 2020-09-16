import React from 'react';

import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Link as RouterLink } from 'react-router-dom';
import { useAuthState } from 'ra-core';
import { Redirect } from 'react-router';

import { UnAuthenticatedLayoutWithTheme } from '../layout';
import illustration from './mapfre_main.jpg';
import { LandingPageApis } from './LandingPageApis';

export const LandingPage = () => {
    const classes = useStyles();
    const { loading, authenticated } = useAuthState();

    if (loading) {
        return null;
    }

    if (authenticated) {
        return <Redirect to="/apis" />;
    }

    return (
        <UnAuthenticatedLayoutWithTheme showActions>
            <Grid className={classes.heroContainer} container spacing={4}>
                <Grid item xs={12}>
                    <img
                        src={illustration}
                        alt="A doctor with a stethoscope"
                        className={classes.illustration}
                    />
                </Grid>
                <Grid item xs={12} md={6} className={classes.welcomeContainer}>
                    <Typography variant="h1" className={classes.title}>
                        Mapfre
                    </Typography>
                    <Typography
                        component="span"
                        variant="h2"
                        className={classes.subtitle}
                        gutterBottom
                    >
                        Developer Center
                    </Typography>
                    <Typography>
                        Here you can consult all API products we offer.
                    </Typography>
                    <Typography gutterBottom>
                        From a functional documentation you can navigate to a
                        more technical specification.
                    </Typography>
                    <div className={classes.heroButtonsContainer}>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="secondary"
                            component={RouterLink}
                            to="/signup"
                        >
                            Join now
                        </Button>
                        <Button
                            className={classes.secondaryButton}
                            variant="outlined"
                            color="secondary"
                        >
                            Read more
                        </Button>
                    </div>
                </Grid>
                <Grid item xs={12} md={12}>
                    <LandingPageApis />
                </Grid>
            </Grid>
        </UnAuthenticatedLayoutWithTheme>
    );
};

const useStyles = makeStyles(theme => ({
    heroContainer: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(8),
    },
    welcomeContainer: {
        marginTop: theme.spacing(8),
    },
    title: {
        fontSize: theme.typography.fontSize * 2,
    },
    subtitle: {
        textTransform: 'uppercase',
        fontWeight: 800,
        whiteSpace: 'break-spaces',
        maxWidth: '50%',
        display: 'inline-block',
        lineHeight: 0.9,
    },
    illustration: {
        height: '100%',
        width: '100%',
    },
    heroButtonsContainer: {
        marginTop: theme.spacing(4),
    },
    button: {},
    secondaryButton: {
        marginLeft: theme.spacing(2),
    },
    sectionTitle: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(8),
    },
    features: {
        textAlign: 'center',
        marginBottom: theme.spacing(8),
        '& li': {
            display: 'flex',
            justifyContent: 'center',
            listStyle: 'none',
            marginBottom: theme.spacing(1),
            '& :first-child': {
                marginRight: theme.spacing(1),
            },
        },
    },
    cards: {
        alignItems: 'stretch',
        justifyContent: 'center',
        '& > li': {
            display: 'flex',
            alignItems: 'stretch',
        },
    },
    card: {
        backgroundColor: theme.palette.common.white,
        borderRadius: theme.spacing(1),
        color: theme.palette.common.black,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        '& > :first-child': {
            flex: 1,
            paddingTop: theme.spacing(4),
        },
        '& h4': {
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(4),
        },
        '& img': {
            height: '50%',
        },
    },
    cardActions: {
        justifyContent: 'space-around',
        marginBottom: theme.spacing(2),
    },
}));
