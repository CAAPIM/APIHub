import React from 'react';
import { useTranslate } from 'ra-core';
import get from 'lodash/get';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import format from 'date-fns/format';

export const LastUpdateField = ({
    basePath,
    record,
    source,
    addPrefix,
    ...props
}) => {
    const value = get(record, source);
    const translate = useTranslate();

    if (!value) {
        return null;
    }

    const date = new Date(value);
    const formattedDate = format(date, 'P');

    let label = addPrefix
        ? translate('resources.apis.last_update.fields.updated', {
              date: formattedDate,
          })
        : formattedDate;

    return (
        <Tooltip title={format(date, 'P')}>
            <Typography variant="body2" {...props}>
                {label}
            </Typography>
        </Tooltip>
    );
};
