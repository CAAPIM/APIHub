// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import get from 'lodash/get';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { format } from 'date-fns';
import { useRecordContext, useTranslate } from 'react-admin';

export const LastUpdateField = ({ basePath, source, addPrefix, ...props }) => {
    let record = useRecordContext();
    if (props.record != null) {
        record = props.record;
    }
    const value = get(record, source);
    const translate = useTranslate();

    if (!value) {
        return null;
    }

    const date = new Date(value);
    const formattedDate = format(date, 'MM/DD/YYYY');

    let label = addPrefix
        ? translate('resources.apis.last_update.fields.updated', {
              date: formattedDate,
          })
        : formattedDate;

    return (
        <Tooltip title={format(date, 'MM/DD/YYYY')}>
            <Typography variant="body2" {...props}>
                {label}
            </Typography>
        </Tooltip>
    );
};
