import React from 'react';
import { useTranslate } from 'ra-core';
import classnames from 'classnames';
import get from 'lodash/get';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

export const AccessField = ({
    basePath,
    cellClassName, // Use by react admin, should not propagate
    headerClassName, // Use by react admin, should not propagate
    record,
    source,
    translationKey,
    ...props
}) => {
    const value = get(record, source);
    const enabled = value === 'ENABLED';
    const color = enabled ? 'primary' : 'default';
    const classes = useStyles();
    const translate = useTranslate();

    return (
        <Chip
            color={color}
            disabled={!enabled}
            className={classnames(classes.root, { [classes.enabled]: enabled })}
            label={
                value
                    ? translate(`${translationKey}.${value.toLowerCase()}`)
                    : ''
            }
            {...props}
        />
    );
};

const useStyles = makeStyles(
    theme => ({
        root: { borderRadius: theme.spacing(0.5) },
        enabled: {
            backgroundColor: theme.palette.success.main,
        },
    }),
    {
        name: 'Layer7AccessField',
    }
);
