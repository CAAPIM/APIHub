// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import * as React from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

export function ApiSelectedItem(props) {
    const { item } = props;
    const { classes } = useStyles(props);

    return (
        <>
            <Typography>{item.record.name}</Typography>
            <Typography className={classes.version}>
                v{item.record.version}
            </Typography>
        </>
    );
}

const useStyles = makeStyles()(
    theme => ({
        version: {
            color: theme.palette.text.secondary,
            marginLeft: theme.spacing(1),
        },
    }),
    {
        name: 'Layer7ApiSelectedItem',
    }
);
