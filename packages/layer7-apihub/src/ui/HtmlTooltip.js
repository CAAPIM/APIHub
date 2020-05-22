import React from 'react';
import { Tooltip } from '@material-ui/core';

export const textToHtml = text => text.replace(/\n/g, '<br />');

export const HtmlTooltip = ({ children, title, ...rest }) => {
    const html = textToHtml(title);

    return (
        <Tooltip
            title={
                <div
                    dangerouslySetInnerHTML={{
                        __html: html,
                    }}
                />
            }
            aria-label={title}
            {...rest}
        >
            {children}
        </Tooltip>
    );
};
