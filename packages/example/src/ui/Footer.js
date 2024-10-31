import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

export const Footer = () => {
    const classes = useStyles();
    const showCopyright = localStorage.getItem('SHOW_COPYRIGHT');
    return (
        <div className={classes.root}>
            {showCopyright === 'true' && (
                <Typography
                    color="textSecondary"
                    variant="body2"
                    className={classes.copyright}
                >
                    Copyright © 2024 Broadcom. All Rights Reserved
                </Typography>
            )}
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4),
    },
    copyright: {
        fontSize: '0.75rem',
    },
}));
