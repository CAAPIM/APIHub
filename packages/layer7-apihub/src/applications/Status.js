import React from 'react';
import classnames from 'classnames';
import { useTranslate } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: 'auto',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
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
}));

export const Status = ({ record, variant = 'body2' }) => {
    const classes = useStyles();
    const translate = useTranslate();

    if (!record) {
        return null;
    }

    return (
        <div
            className={classnames(classes.root, {
                [classes.enabled]: record.status === 'ENABLED',
                [classes.rejected]: record.status === 'REJECTED',
                [classes.disabled]:
                    record.status !== 'ENABLED' && record.status !== 'REJECTED',
            })}
        >
            <div className={classes.enabledIcon} />
            {record.status && (
                <Typography variant={variant}>
                    {translate(
                        `resources.applications.status.${record.status.toLowerCase()}`
                    )}
                </Typography>
            )}
        </div>
    );
};
