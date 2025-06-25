// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { cloneElement } from 'react';
import { makeStyles } from 'tss-react/mui';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

export const Stats = ({ children, icon, title, ...rest }) => {
    const { classes, cx } = useStyles();

    return (
        <Tooltip title={title}>
            <Grid container alignItems="center" className={classes.root}>
                {cloneElement(icon, {
                    className: cx(classes.icon, icon.className),
                })}
                {children}
            </Grid>
        </Tooltip>
    );
};

export const StatsText = ({ children, ...rest }) => {
    const classes = useStyles(rest);
    return (
        <Typography
            variant="caption"
            color="textSecondary"
            className={classes.text}
        >
            {children}
        </Typography>
    );
};

const useStyles = makeStyles({ name: 'Layer7Stats' })(
    theme => ({
        root: {
            marginRight: theme.spacing(2),
            width: 'auto',
        },
        icon: {
            marginRight: theme.spacing(),
        },
        text: {},
    })
);
