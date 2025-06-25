// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { TextField, useRecordContext } from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import Tooltip from '@mui/material/Tooltip';
import get from 'lodash/get';

export const TruncatedTextField = props => {
    const { classes } = useStyles();
    const { source } = props;
    let record = useRecordContext();
    if (props.record != null) {
        record = props.record;
    }
    const value = get(record, source);

    return (
        <Tooltip title={value || ''}>
            <TextField className={classes.root} {...props} />
        </Tooltip>
    );
};

const useStyles = makeStyles({ name: 'Layer7TruncatedTextField' })(theme => ({
    root: {
        display: 'inline-block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '15vw',
        [theme.breakpoints.up('lg')]: {
            maxWidth: '10vw',
        },
    },
}));
