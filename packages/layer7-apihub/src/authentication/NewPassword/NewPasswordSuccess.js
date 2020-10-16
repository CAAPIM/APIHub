import React from 'react';
import { useTranslate } from 'ra-core';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

export const NewPasswordSuccess = props => {
    const translate = useTranslate();
    const classes = useStyles(props);

    return (
        <div className={classes.root}>
            <Typography className={classes.title} variant="body1" gutterBottom>
                {translate('apihub.new_password.notifications.confirmation')}
            </Typography>
            <Button
                className={classes.button}
                color="primary"
                variant="contained"
                component={Link}
                to="/login"
            >
                {translate('apihub.new_password.actions.open_login_page')}
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
        name: 'Layer7NewPasswordSuccess',
    }
);
