// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

export const Footer = () => {
    const { classes } = useStyles();
    const showCopyright = localStorage.getItem('SHOW_COPYRIGHT');
    return (
        <div className={classes.root}>
            {showCopyright === 'true' && (
                <Typography
                    color="textSecondary"
                    variant="body2"
                    className={classes.copyright}
                >
                    Copyright © 2025 Broadcom. All Rights Reserved
                </Typography>
            )}
        </div>
    );
};

const useStyles = makeStyles()(theme => ({
    root: {
        padding: theme.spacing(4),
    },
    copyright: {
        fontSize: '0.75rem',
    },
}));
