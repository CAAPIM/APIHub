// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import get from 'lodash/get';
import { TextField, useRecordContext } from 'react-admin';
import removeMarkdown from 'remove-markdown';

import { MarkdownView } from '.';
import { TruncatedTextField } from '../';

export const MarkdownField = ({
    source,
    stripTags = false,
    truncate,
    ...props
}) => {
    let record = useRecordContext();
    if (props.record != null) {
        record = props.record;
    }
    const value = get(record, source);

    if (stripTags) {
        const newRecord = { ...record, ...{ [source]: removeMarkdown(value) } };
        return truncate ? (
            <TruncatedTextField record={newRecord} source={source} {...props} />
        ) : (
            <TextField record={newRecord} source={source} {...props} />
        );
    }

    return <MarkdownView value={value} {...props} />;
};
