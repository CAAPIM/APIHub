// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useTranslate } from 'react-admin';
import { makeStyles } from 'tss-react/mui';

export const UserProfileTitle = () => {
    const translate = useTranslate();
    const { classes } = useStyles();

    return (
        <div className={classes.root}>
            {translate('resources.userContexts.title')}
        </div>
    );
};

const useStyles = makeStyles({ name: 'Layer7UserContextTitle' })(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
}));
