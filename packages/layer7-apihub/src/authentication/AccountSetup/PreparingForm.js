import React from 'react';
import { useTranslate } from 'ra-core';
import { Typography, LinearProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        marginBottom: theme.spacing(),
    },
}));

export const PreparingForm = props => {
    const translate = useTranslate();
    const classes = useStyles(props);

    return (
        <>
            <Typography variant="body1" className={classes.root}>
                {translate('apihub.account_setup.notifications.prepare')}
            </Typography>
            <LinearProgress />
        </>
    );
};
