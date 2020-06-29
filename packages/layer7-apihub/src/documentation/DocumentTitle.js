import React from 'react';
import { useTranslate } from 'ra-core';

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
