import React from 'react';
import classnames from 'classnames';
import { useTranslate } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

export const ApplicationStatus = ({ record, variant = 'caption', ...rest }) => {
    const classes = useStyles(rest);
    const translate = useTranslate();

    if (!record) {
        return null;
    }

    return (
        <div className={classes.root}>
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

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: 'auto',
        },
        status: {
            fontWeight: '500',
        },
    }),
    {
        name: 'HealthcareApplicationStatus',
    }
);

const useIconStyles = makeStyles(
    theme => ({
        root: {
            width: theme.spacing(2),
            height: theme.spacing(2),
            borderRadius: 99999,
        },
        enabled: {
            backgroundColor: theme.palette.success.main,
        },
        rejected: {
            backgroundColor: theme.palette.error.main,
        },
        disabled: {
            backgroundColor: theme.palette.text.disabled,
        },
    }),
    {
        name: 'HealthcareApplicationStatusIcon',
    }
);

export const ApplicationStatusIcon = ({ record, ...rest }) => {
    const classes = useIconStyles(rest);

    return (
        <div
            className={classnames(classes.root, {
                [classes.enabled]: record.status === 'ENABLED',
                [classes.rejected]: record.status === 'REJECTED',
                [classes.disabled]:
                    record.status !== 'ENABLED' && record.status !== 'REJECTED',
            })}
        />
    );
};
