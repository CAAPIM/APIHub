// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useRecordContext, useTranslate } from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import { get } from 'lodash';

export const ApiStatus = ({ variant = 'caption', ...props }) => {
    const { classes, cx } = useStyles();
    const translate = useTranslate();
    let record = useRecordContext();
    if (props.record != null) {
        record = props.record;
    }
    const value = get(record, 'portalStatus') || get(record, 'status');

    return (
        <div
            className={cx(classes.root, {
                [classes.enabled]: value === 'ENABLED',
                [classes.disabled]: value !== 'ENABLED',
            })}
        >
            <div className={classes.enabledIcon} />
            <Typography className={classes.status} variant={variant}>
                {value
                    ? translate(
                          `resources.apis.portalStatus.${value.toLowerCase()}`
                      )
                    : ''}
            </Typography>
        </div>
    );
};

const useStyles = makeStyles({ name: 'Layer7ApiStatus' })(
    (theme, _params, classes) => ({
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: 'auto',
            marginRight: '60px',
        },
        enabled: {
            color: theme.palette.success.main,
            [`& .${classes.enabledIcon}`]: {
                backgroundColor: theme.palette.success.main,
            },
        },
        rejected: {
            color: theme.palette.error.main,
            [`& .${classes.enabledIcon}`]: {
                backgroundColor: theme.palette.error.main,
            },
        },
        disabled: {
            color: theme.palette.text.disabled,
            [`& .${classes.enabledIcon}`]: {
                backgroundColor: theme.palette.text.disabled,
            },
        },
        enabledIcon: {
            width: theme.spacing(1.5),
            height: theme.spacing(1.5),
            borderRadius: 99999,
            marginRight: theme.spacing(),
        },
        status: {}, // Used for theming
    })
);
