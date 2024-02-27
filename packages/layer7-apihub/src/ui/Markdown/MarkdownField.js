import React from 'react';
import get from 'lodash/get';
import { TextField } from 'react-admin';
import removeMarkdown from 'remove-markdown';

import { MarkdownView } from '.';
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
        const newRecord = { ...record, ...{ [source]: removeMarkdown(value) } };
        return truncate ? (
            <TruncatedTextField record={newRecord} source={source} {...rest} />
        ) : (
            <TextField record={newRecord} source={source} {...rest} />
        );
    }

    return <MarkdownView value={value} {...rest} />;
};
