import React, { forwardRef } from 'react';

import { markdownRenderer as defaultMarkdownRenderer } from '.';

export const MarkdownView = forwardRef(
    (
        {
            value,
            markdownRenderer = defaultMarkdownRenderer,
            markdownOptions = {},
            ...props
        },
        ref
    ) => {
        return (
            <div ref={ref} {...props}>
                {markdownRenderer(value, markdownOptions)}
            </div>
        );
    }
);
