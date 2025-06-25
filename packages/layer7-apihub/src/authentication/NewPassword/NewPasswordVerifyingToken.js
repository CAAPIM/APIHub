// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useTranslate } from 'react-admin';
import { Typography, LinearProgress } from '@mui/material';

import { makeStyles } from 'tss-react/mui';

export const NewPasswordVerifyingToken = props => {
    const translate = useTranslate();
    const { classes } = useStyles(props);

    return (
        <div className={classes.root}>
            <Typography className={classes.title} variant="body1" gutterBottom>
                {translate('apihub.new_password.notifications.verifying_token')}
            </Typography>
            <LinearProgress />
        </div>
    );
};

const useStyles = makeStyles({ name: 'Layer7NewPasswordVerifyingToken' })(
    theme => ({
        root: {},
        title: {
            color: theme.palette.text.primary,
        },
    })
);
