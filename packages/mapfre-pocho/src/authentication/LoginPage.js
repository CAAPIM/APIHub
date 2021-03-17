import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { Link as RouterLink } from 'react-router-dom';

import { UnAuthenticatedLayoutWithTheme } from '../layout';
import { LoginForm } from './LoginForm';

export const LoginPage = props => {
    const classes = useStyles();
    return (
        <UnAuthenticatedLayoutWithTheme showActions={false}>
            <Grid container className={classes.content}>
                <Grid item xs={4} className={classes.login}>
                    <Typography component="h1" variant="h3" gutterBottom>
                        Login
                    </Typography>
                    <Card>
                        <CardContent className={classes.loginContent}>
                            <LoginForm />
                        </CardContent>
                        <Divider />
                        <CardContent className={classes.loginContent}>
                            <Typography align="center" gutterBottom>
                                Don't have an account?
                            </Typography>
                            <Button
                                component={RouterLink}
                                to="/signup"
                                color="primary"
                                variant="outlined"
                                className={classes.signUp}
                            >
                                Join Now
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </UnAuthenticatedLayoutWithTheme>
    );
};

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            background: `#c10003`,
            color: theme.palette.common.white,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: '70%',
        },
    },
    content: {
        marginTop: theme.spacing(8),
        flex: 1,
    },
    login: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    loginContent: {
        padding: theme.spacing(6),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        '& button': {},
    },
    signUp: {
        borderRadius: theme.spacing(4),
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: theme.spacing(2),
    },
}));
