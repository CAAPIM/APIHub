import * as React from 'react';
import { Typography, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslate } from 'ra-core';

export function ApiGroupSelectedItem(props) {
    const { item } = props;
    const translate = useTranslate();
    const classes = useStyles(props);

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

const useStyles = makeStyles(
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
    }),
    {
        name: 'Layer7ApiGroupSelectedItem',
    }
);
