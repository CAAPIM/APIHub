// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useTranslate } from 'react-admin';
import get from 'lodash/get';
import Typography from '@mui/material/Typography';
import { useRecordContext } from 'react-admin';

export const VisibilityField = ({ basePath, source, ...props }) => {
    let record = useRecordContext();
    if (props.record != null) {
        record = props.record;
    }
    const value = get(record, source);
    const translate = useTranslate();

    return (
        <Typography variant="body2" {...props}>
            {translate(`resources.apis.accessStatus.${value.toLowerCase()}`)}
        </Typography>
    );
};
