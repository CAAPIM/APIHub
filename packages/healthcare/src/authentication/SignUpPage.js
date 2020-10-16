import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { useSignup, useLayer7Notify } from 'layer7-apihub';

import { UnAuthenticatedLayoutWithTheme } from '../layout';
import { SignUpForm } from './SignUpForm';
import controlIllustration from './control.png';
import buildIllustration from './build.png';
import manageIllustration from './manage.png';
import signupIllustration from './signup.png';

export const SignUpPage = () => {
    const classes = useStyles();
    const theme = useTheme();
    const notify = useLayer7Notify();

    const [signup] = useSignup();

    const handleSubmit = data => {
        signup(data, {
            onSuccess: () => {
                notify('resources.registrations.notifications.confirmation');
            },
            onFailure: error => {
                notify(
                    error || 'resources.registrations.notifications.error',
                    'error'
                );
            },
        });
    };
    return (
        <UnAuthenticatedLayoutWithTheme>
            <div className={classes.root}>
                <Grid component="section" container className={classes.section}>
                    <Grid item xs={6}>
                        <Typography component="h1" variant="h3" gutterBottom>
                            Join Now
                        </Typography>
                        <Typography gutterBottom>
                            Join us and build the tools that will change the
                            future of healthcare.
                        </Typography>
                        <ul className={classes.list}>
                            <Typography component="li">
                                <CheckIcon color="secondary" /> Access our
                                extensive catalog of APIs and be first to try
                                them
                            </Typography>
                            <Typography component="li">
                                <CheckIcon color="secondary" /> Enjoy unlimited
                                API calls
                            </Typography>
                            <Typography component="li">
                                <CheckIcon color="secondary" /> Get full access
                                to our DevOps Team
                            </Typography>
                            <Typography component="li">
                                <CheckIcon color="secondary" /> Gain access to
                                Production Endpoints
                            </Typography>
                        </ul>
                        <div className={classes.actions}>
                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                            >
                                Join Now
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                className={classes.secondaryButton}
                            >
                                View FAQs
                            </Button>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <img
                            src={signupIllustration}
                            className={classes.illustration}
                            alt="A person with multiple devices behind them"
                        />
                    </Grid>
                </Grid>
                <section className={classes.section}>
                    <GridList
                        rows={1}
                        cols={3}
                        spacing={theme.spacing(4)}
                        cellHeight="auto"
                    >
                        <GridListTile xs={4}>
                            <Card className={classes.card}>
                                <CardMedia
                                    className={classes.media}
                                    image={controlIllustration}
                                    title="Contemplative Reptile"
                                />
                                <CardContent className={classes.cardContent}>
                                    <Typography
                                        variant="h5"
                                        color="primary"
                                        gutterBottom
                                    >
                                        Control
                                    </Typography>
                                    <Typography>
                                        Securely access rich patient records.
                                        You can concentrate on building your
                                        application knowing that our
                                        industry-leading privacy engine and API
                                        manager has data privacy control and
                                        security covered.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </GridListTile>
                        <GridListTile xs={4}>
                            <Card className={classes.card}>
                                <CardMedia
                                    className={classes.media}
                                    image={buildIllustration}
                                    title="Contemplative Reptile"
                                />
                                <CardContent className={classes.cardContent}>
                                    <Typography
                                        variant="h5"
                                        color="primary"
                                        gutterBottom
                                    >
                                        Build
                                    </Typography>
                                    <Typography>
                                        Build on our Health platforms. Leverage
                                        our global footprint and connect with
                                        our customers who are committed to
                                        making healthcare better.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </GridListTile>
                        <GridListTile xs={4}>
                            <Card className={classes.card}>
                                <CardMedia
                                    className={classes.media}
                                    image={manageIllustration}
                                    title="Contemplative Reptile"
                                />
                                <CardContent className={classes.cardContent}>
                                    <Typography
                                        variant="h5"
                                        color="primary"
                                        gutterBottom
                                    >
                                        Manage
                                    </Typography>
                                    <Typography>
                                        Tools are provided to manage, build and
                                        test. Our Health Developer Portal
                                        provides self-service tools for you to
                                        manage your applications and includes
                                        great documentation to guide you every
                                        step of the way.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </GridListTile>
                    </GridList>
                </section>
                <section className={classes.section}>
                    <Typography component="h2" variant="h4" gutterBottom>
                        Register for an account
                    </Typography>
                    <Typography gutterBottom>
                        The developer portal gives third parties access to our
                        APIs along with a sandbox environment provisioned to
                        help you gain early access and to provide feedback on
                        our integrated solution.
                    </Typography>
                    <Card className={classes.signUp}>
                        <SignUpForm onSubmit={handleSubmit} />
                    </Card>
                </section>
            </div>
        </UnAuthenticatedLayoutWithTheme>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        paddingTop: theme.spacing(8),
    },
    list: {
        listStyle: 'none',
        paddingLeft: 0,
        marginTop: theme.spacing(6),
        '& li': {
            alignItems: 'center',
            display: 'flex',
            marginBottom: theme.spacing(1),
            '& :first-child': {
                marginRight: theme.spacing(1),
            },
        },
    },
    actions: {
        marginTop: theme.spacing(4),
    },
    button: {},
    secondaryButton: {
        marginLeft: theme.spacing(2),
    },
    illustration: {
        width: '100%',
        marginTop: theme.spacing(-12),
        marginBottom: theme.spacing(-12),
    },
    section: {
        paddingBottom: theme.spacing(4),
        paddingTop: theme.spacing(8),
    },
    card: {
        height: '100%',
    },
    media: {
        backgroundColor: theme.palette.action.selected,
        backgroundSize: '20%',
        height: 200,
    },
    cardContent: {
        paddingTop: theme.spacing(6),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        '&:last-child': {
            paddingBottom: theme.spacing(8),
        },
    },
    signUp: {
        marginTop: theme.spacing(8),
    },
}));
