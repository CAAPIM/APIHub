import React from 'react';
import { useTranslate } from 'ra-core';
import { Typography, LinearProgress, makeStyles } from '@material-ui/core';

export const NewPasswordVerifyingToken = props => {
    const translate = useTranslate();
    const classes = useStyles(props);

    return (
        <div className={classes.root}>
            <Typography className={classes.title} variant="body1" gutterBottom>
                {translate('apihub.new_password.notifications.verifying_token')}
            </Typography>
            <LinearProgress />
        </div>
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {},
        title: {
            color: theme.palette.text.primary,
        },
    }),
    {
        name: 'Layer7NewPasswordVerifyingToken',
    }
);
