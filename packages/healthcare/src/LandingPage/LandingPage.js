import React from 'react';

import { makeStyles, useTheme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CheckIcon from '@material-ui/icons/Check';
import { Link as RouterLink } from 'react-router-dom';
import { useAuthState } from 'ra-core';
import { Redirect } from 'react-router';

import { UnAuthenticatedLayoutWithTheme } from '../layout';
import {
    OptimizeHealthcare,
    EmpoweringPatients,
    EarlyDetection,
} from './illustrations';
import illustration from './illustration.png';

export const LandingPage = () => {
    const classes = useStyles();
    const theme = useTheme();
    const { loading, authenticated } = useAuthState();

    if (loading) {
        return null;
    }

    if (authenticated) {
        return <Redirect to="/dashboard" />;
    }

    return (
        <UnAuthenticatedLayoutWithTheme showActions>
            <Grid className={classes.heroContainer} container spacing={4}>
                <Grid item xs={12} md={6} className={classes.welcomeContainer}>
                    <Typography variant="h1" className={classes.title}>
                        Healthcare
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
                        Build innovative applications for different healthcare
                        scenarios.
                    </Typography>
                    <Typography gutterBottom>
                        Safely and easily access data and capabilities from
                        within our Health platforms.
                    </Typography>
                    <Typography gutterBottom>
                        Join us and build the tools that will change the future
                        of healthcare.
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
                <Grid item xs={12} md={6}>
                    <img
                        src={illustration}
                        alt="A doctor with a stethoscope"
                        className={classes.illustration}
                    />
                </Grid>
            </Grid>
            <Typography
                component="h2"
                variant="h3"
                align="center"
                className={classes.sectionTitle}
            >
                Why build with our health platforms?
            </Typography>
            <ul className={classes.features}>
                <li>
                    <CheckIcon color="secondary" />
                    <Typography>
                        We use open standards, so there's no vendor lock-in.
                    </Typography>
                </li>
                <li>
                    <CheckIcon color="secondary" />
                    <Typography>
                        We handle privacy, so you don't have to.
                    </Typography>
                </li>
                <li>
                    <CheckIcon color="secondary" />
                    <Typography>
                        We use our own APIs, so we are interested in making them
                        work for you as well.
                    </Typography>
                </li>
            </ul>
            <Typography
                component="h2"
                variant="h3"
                align="center"
                className={classes.sectionTitle}
            >
                Ideas to get you started
            </Typography>
            <GridList
                cellHeight="auto"
                cols={3}
                rows={1}
                spacing={theme.spacing(4)}
                className={classes.cards}
            >
                <GridListTile>
                    <Card className={classes.card}>
                        <CardContent>
                            <img
                                src={EmpoweringPatients}
                                alt="A box of pills"
                            />
                            <Typography
                                component="h4"
                                color="primary"
                                gutterBottom
                                variant="h5"
                            >
                                Empowering Patients
                            </Typography>
                            <Typography>
                                Providing patients with tools to help them
                                understand their prescriptions and possible side
                                effects when prescribed along with ...
                            </Typography>
                        </CardContent>
                        <CardActions className={classes.cardActions}>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="secondary"
                                size="large"
                            >
                                Learn more
                            </Button>
                        </CardActions>
                    </Card>
                </GridListTile>
                <GridListTile>
                    <Card className={classes.card}>
                        <CardContent>
                            <img
                                src={EarlyDetection}
                                alt="A doctor with a stethoscope"
                            />
                            <Typography
                                component="h4"
                                color="primary"
                                gutterBottom
                                variant="h5"
                            >
                                Early Detection
                            </Typography>
                            <Typography>
                                In the highly connected world, there are no
                                excuses why we cannot help you detect your
                                symptoms earlier using ...
                            </Typography>
                        </CardContent>
                        <CardActions className={classes.cardActions}>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="secondary"
                            >
                                Learn more
                            </Button>
                        </CardActions>
                    </Card>
                </GridListTile>
                <GridListTile>
                    <Card className={classes.card}>
                        <CardContent>
                            <img
                                src={OptimizeHealthcare}
                                alt="A doctor with a stethoscope"
                            />
                            <Typography
                                component="h4"
                                color="primary"
                                gutterBottom
                                variant="h5"
                            >
                                Optimizing Healthcare
                            </Typography>
                            <Typography>
                                Ask any doctor or nurse about the problems they
                                face in their day to day work and they will tell
                                you how much time they waste on routine tasks...
                            </Typography>
                        </CardContent>
                        <CardActions className={classes.cardActions}>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="secondary"
                            >
                                Learn more
                            </Button>
                        </CardActions>
                    </Card>
                </GridListTile>
            </GridList>
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
