// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import { useRecordContext, useTranslate } from 'react-admin';

export const ApplicationStatus = ({ variant = 'caption', ...props }) => {
    const { classes, cx } = useStyles(props);
    const translate = useTranslate();
    let record = useRecordContext();
    if (props.record != null) {
        record = props.record;
    }
    if (!record) {
        return null;
    }

    return (
        <div
            className={cx(classes.root, {
                [classes.enabled]: record.status === 'ENABLED',
                [classes.rejected]: record.status === 'REJECTED',
                [classes.disabled]:
                    record.status !== 'ENABLED' && record.status !== 'REJECTED',
            })}
        >
            <div className={classes.enabledIcon} />
            {record.status && (
                <Typography className={classes.status} variant={variant}>
                    {translate(
                        `resources.applications.status.${record.status.toLowerCase()}`
                    )}
                </Typography>
            )}
        </div>
    );
};

const useStyles = makeStyles({ name: 'Layer7ApplicationStatus' })(
    (theme, _params, classes) => ({
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: 'auto',
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
