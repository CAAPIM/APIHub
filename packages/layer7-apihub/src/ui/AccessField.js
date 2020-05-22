import React from 'react';

import { useTranslate } from 'ra-core';
import classnames from 'classnames';
import get from 'lodash/get';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const useAccessFieldStyles = makeStyles(theme => ({
    root: { borderRadius: theme.spacing(0.5) },
    enabled: {
        backgroundColor: theme.palette.success.main,
    },
}));

export const AccessField = ({
    basePath,
    record,
    source,
    translationKey,
    ...props
}) => {
    const value = get(record, source);
    const enabled = value === 'ENABLED';
    const color = enabled ? 'primary' : 'default';
    const classes = useAccessFieldStyles();
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
