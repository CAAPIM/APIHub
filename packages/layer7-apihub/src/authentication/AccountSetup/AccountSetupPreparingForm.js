import React from 'react';
import { useTranslate } from 'ra-core';
import { Typography, LinearProgress, makeStyles } from '@material-ui/core';

export const AccountSetupPreparingForm = props => {
    const translate = useTranslate();
    const classes = useStyles(props);

    return (
        <div className={classes.root}>
            <Typography className={classes.title} variant="body1" gutterBottom>
                {translate('apihub.account_setup.notifications.prepare')}
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
        name: 'Layer7AccountSetupPreparingForm',
    }
);
