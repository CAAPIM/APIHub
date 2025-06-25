// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useTranslate } from 'react-admin';

export const DocumentTitle = () => {
    const translate = useTranslate();

    return (
        <span>
            {translate(`resources.documents.name`, {
                smart_count: 2,
            })}
        </span>
    );
};
