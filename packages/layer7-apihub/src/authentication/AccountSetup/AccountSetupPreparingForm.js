// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useTranslate } from 'react-admin';
import { Typography, LinearProgress } from '@mui/material';

import { makeStyles } from 'tss-react/mui';

export const AccountSetupPreparingForm = props => {
    const translate = useTranslate();
    const { classes } = useStyles(props);

    return (
        <div className={classes.root}>
            <Typography className={classes.title} variant="body1" gutterBottom>
                {translate('apihub.account_setup.notifications.prepare')}
            </Typography>
            <LinearProgress />
        </div>
    );
};

const useStyles = makeStyles({ name: 'Layer7AccountSetupPreparingForm' })(
    theme => ({
        root: {},
        title: {
            color: theme.palette.text.primary,
        },
    })
);
