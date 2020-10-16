import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export const HomePageExploreAPIs = props => {
    const classes = useStyles(props);

    return (
        <div className={classes.root}>
            <Typography className={classes.subtitle} variant="subtitle1">
                Ready to build your solution?
            </Typography>
            <Typography className={classes.title} variant="h2" color="primary">
                Review the documentation to get started.
            </Typography>
            <div className={classes.callToAction}>
                <Button
                    to="/apis"
                    variant="contained"
                    color="secondary"
                    size="large"
                    className={classes.watchButton}
                    component={RouterLink}
                >
                    Explore APIs
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    className={classes.watchButton}
                >
                    Watch Tutorial
                </Button>
            </div>
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: theme.spacing(10, 0, 2),
    },
    title: {
        textTransform: 'none',
        fontSize: '2rem',
    },
    subtitle: {},
    callToAction: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: theme.spacing(4, 0),
    },
    apisButton: {
        margin: theme.spacing(0, 2),
    },
    watchButton: {
        margin: theme.spacing(0, 2),
    },
}));
