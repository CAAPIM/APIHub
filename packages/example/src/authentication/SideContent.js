// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { makeStyles } from 'tss-react/mui';

import { ContentLogo } from '../ui';

export const SideContent = () => {
    const { classes } = useStyles();

    return (
        <div className={classes.root}>
            <ContentLogo className={classes.logo} />
        </div>
    );
};

const useStyles = makeStyles()(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            maxWidth: '700px',
            margin: theme.spacing(2),
        },
    },
    logo: {
        height: '100%',
        width: '100%',
    },
}));
