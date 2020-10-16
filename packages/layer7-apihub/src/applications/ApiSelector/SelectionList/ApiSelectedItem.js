import * as React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export function ApiSelectedItem(props) {
    const { item } = props;
    const classes = useStyles(props);

    return (
        <>
            <Typography>{item.record.name}</Typography>
            <Typography className={classes.version}>
                v{item.record.version}
            </Typography>
        </>
    );
}

const useStyles = makeStyles(
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
