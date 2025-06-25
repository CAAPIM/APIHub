// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import get from 'lodash/get';
import { makeStyles } from 'tss-react/mui';
import Chip from '@mui/material/Chip';
import { useRecordContext, useTranslate } from 'react-admin';

export const AccessField = props => {
    const { source, translationKey } = props;
    let record = useRecordContext();
    if (props.record != null) {
        record = props.record;
    }
    const value = get(record, source);
    const enabled = value === 'ENABLED';
    const color = enabled ? 'primary' : 'default';
    const { classes, cx } = useStyles();
    const translate = useTranslate();

    return (
        <Chip
            disabled={!enabled}
            className={cx(classes.root, { [classes.enabled]: enabled })}
            label={
                value
                    ? translate(`${translationKey}.${value.toLowerCase()}`)
                    : ''
            }
            {...props}
        />
    );
};

const useStyles = makeStyles({ name: 'Layer7AccessField' })(theme => ({
    root: { borderRadius: theme.spacing(0.5) },
    enabled: {
        backgroundColor: theme.palette.success.main,
    },
}));
