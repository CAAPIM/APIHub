// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { forwardRef } from 'react';
import MDPreview from '@uiw/react-markdown-preview';

export const MarkdownView = forwardRef(({ value, ...props }, ref) => {
    return (
        <div ref={ref} {...props}>
            <MDPreview data-color-mode="light" source={value} />
        </div>
    );
});
