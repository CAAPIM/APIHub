import React from 'react';
import classnames from 'classnames';
import { useTranslate } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

export const ApiStatus = ({ record, variant = 'caption' }) => {
    const classes = useStyles();
    const translate = useTranslate();
    if (!record.portalStatus) {
        record.portalStatus = record.status || '';
    }

    if (!record) {
        return null;
    }

    return (
        <div
            className={classnames(classes.root, {
                [classes.enabled]: record.portalStatus === 'ENABLED',
                [classes.disabled]: record.portalStatus !== 'ENABLED',
            })}
        >
            <div className={classes.enabledIcon} />
            <Typography className={classes.status} variant={variant}>
                {translate(
                    `resources.apis.portalStatus.${record.portalStatus.toLowerCase()}`
                )}
            </Typography>
        </div>
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: 'auto',
        },
        enabled: {
            color: theme.palette.success.main,
            '& $enabledIcon': {
                backgroundColor: theme.palette.success.main,
            },
        },
        rejected: {
            color: theme.palette.error.main,
            '& $enabledIcon': {
                backgroundColor: theme.palette.error.main,
            },
        },
        disabled: {
            color: theme.palette.text.disabled,
            '& $enabledIcon': {
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
    }),
    {
        name: 'Layer7ApiStatus',
    }
);
