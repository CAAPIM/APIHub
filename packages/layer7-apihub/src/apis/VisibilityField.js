import React from 'react';
import { useTranslate } from 'ra-core';
import get from 'lodash/get';
import Typography from '@material-ui/core/Typography';

export const VisibilityField = ({ basePath, record, source, ...props }) => {
    const value = get(record, source);
    const translate = useTranslate();

    return (
        <Typography variant="body2" {...props}>
            {translate(`resources.apis.accessStatus.${value.toLowerCase()}`)}
        </Typography>
    );
};
