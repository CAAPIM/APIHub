// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import get from 'lodash/get';
import Link from '@mui/material/Link';
import { useRecordContext } from 'react-admin';

export const LinkField = ({ className, source, ...rest }) => {
    let record = useRecordContext();
    if (rest.record != null) {
        record = rest.record;
    }
    const value = get(record, source);
    if (!value) {
        return null;
    }
    return (
        <Link className={className} href={value} {...rest}>
            {value}
        </Link>
    );
};
