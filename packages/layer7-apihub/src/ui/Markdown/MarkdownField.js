import React from 'react';
import get from 'lodash/get';
import { TextField } from 'react-admin';

import { MarkdownView, removeTags } from '.';
import { TruncatedTextField } from '../';

export const MarkdownField = ({
    record,
    source,
    stripTags = false,
    truncate,
    ...rest
}) => {
    const value = get(record, source, '');

    if (stripTags) {
        const newRecord = { ...record, ...{ [source]: removeTags(value) } };
        return truncate ? (
            <TruncatedTextField record={newRecord} source={source} {...rest} />
        ) : (
            <TextField record={newRecord} source={source} {...rest} />
        );
    }

    return <MarkdownView value={value} {...rest} />;
};
