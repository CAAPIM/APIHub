// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { makeStyles } from 'tss-react/mui';

import { ApplicationStatus } from './ApplicationStatus';
import { useRecordContext } from 'react-admin';

export const ApplicationTitle = () => {
    const { classes } = useStyles();
    let record = useRecordContext();

    if (!record) {
        return null;
    }

    return (
        <div className={classes.root}>
            <div>
                <span className={classes.title}>{record.name}</span>
                <ApplicationStatus classes={{ status: classes.status }} />
            </div>
        </div>
    );
};

const useStyles = makeStyles({ name: 'Layer7ApplicationTitle' })(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    title: {},
    status: {
        padding: theme.spacing(1, 0),
    },
}));
