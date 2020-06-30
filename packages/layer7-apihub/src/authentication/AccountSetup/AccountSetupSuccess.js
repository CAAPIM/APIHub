import React from 'react';
import { useTranslate } from 'ra-core';
import { Button, Typography, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

export const AccountSetupSuccess = props => {
    const translate = useTranslate();
    const classes = useStyles(props);

    return (
        <div className={classes.root}>
            <Typography className={classes.title} variant="body1" gutterBottom>
                {translate('apihub.account_setup.notifications.success')}
            </Typography>
            <Button
                color="primary"
                variant="contained"
                component={Link}
                to="/login"
                className={classes.button}
            >
                {translate('apihub.account_setup.actions.open_login_page')}
            </Button>
        </div>
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {},
        title: {
            color: theme.palette.success.main,
        },
        button: {},
    }),
    {
        name: 'Layer7AccountSetupSuccess',
    }
);
