// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import * as React from 'react';
import { Typography, Chip } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTranslate } from 'react-admin';

export function ApiGroupSelectedItem(props) {
    const { item } = props;
    const translate = useTranslate();
    const { classes } = useStyles(props);

    return (
        <>
            <Chip
                className={classes.chip}
                label={translate(`resources.apiGroups.short_name`, {
                    smart_count: 1,
                })}
            />
            <Typography>{item.record.name}</Typography>
            <Typography className={classes.apisCount}>
                ({item.record.apis.length})
            </Typography>
            <Typography className={classes.status}>
                {item.record.status}
            </Typography>
        </>
    );
}

const useStyles = makeStyles({ name: 'Layer7ApiGroupSelectedItem' })(
    theme => ({
        root: {
            display: 'flex',
            alignItems: 'center',
        },
        chip: {
            marginRight: theme.spacing(1),
            height: theme.spacing(3),
        },
        apisCount: {
            color: theme.palette.text.secondary,
            marginLeft: theme.spacing(1),
        },
        status: {
            color: theme.palette.text.secondary,
            marginLeft: theme.spacing(2),
            fontSize: '0.8rem',
            textTransform: 'lowercase',
        },
    })
);
