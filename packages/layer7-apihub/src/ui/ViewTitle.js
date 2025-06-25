// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'tss-react/mui';

export const ViewTitle = props => {
    const { classes } = useStyles();

    return (
        <div className={classes.root}>
            <Typography
                id="react-admin-title"
                variant="h5"
                component="h2"
                color="inherit"
                className={classes.title}
                {...props}
            />
        </div>
    );
};

const useStyles = makeStyles()(
    theme => ({
        root: {
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(),
        },
        title: {
            fontWeight: theme.typography.fontWeightMedium,
            color: theme.palette.getContrastText(
                theme.palette.background.default
            ),
        },
    }),
    {
        name: 'Layer7ViewTitle',
    }
);
