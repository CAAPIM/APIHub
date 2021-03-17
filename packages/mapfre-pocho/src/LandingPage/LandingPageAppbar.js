import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { BrandLogo } from '../ui';

export const LandingPageAppbar = () => {
    const classes = useAppbarStyles();

    return (
        <AppBar
            className={classes.root}
            position="static"
            color="transparent"
            elevation={0}
        >
            <Toolbar>
                <Typography
                    component="h2"
                    variant="h6"
                    className={classes.title}
                >
                    <BrandLogo />
                </Typography>
                <Button
                    component={RouterLink}
                    to="/sign-up"
                    color="inherit"
                    className={classes.button}
                >
                    Join now
                </Button>
                <Button
                    color="inherit"
                    className={classes.button}
                    component={RouterLink}
                    to="/login"
                    endIcon={
                        <AccountCircleIcon className={classes.loginIcon} />
                    }
                >
                    Login
                </Button>
            </Toolbar>
        </AppBar>
    );
};

const useAppbarStyles = makeStyles(theme => ({
    root: {
        background: 'transparent',
    },
    title: {
        paddingTop: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        '& svg': {
            fill: theme.palette.secondary.main,
            marginRight: theme.spacing(1),
        },
        '& span': {
            maxWidth: 100,
            textTransform: 'uppercase',
            lineHeight: 0.9,
            fontWeight: 'bold',
        },
        flexGrow: 1,
    },
    loginIcon: {
        fontSize: '2rem !important',
    },
    button: {
        fontWeight: 'bold',
    },
}));
