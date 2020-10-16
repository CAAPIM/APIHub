import React from 'react';
import ReactMarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

import AccessibleFonts from './plugins/AccessibleFonts';
import { markdownRenderer as defaultMarkdownRenderer } from './';

const defaultOptions = {
    canView: {
        menu: true,
        md: true,
        html: true,
        fullScreen: false,
        hideMenu: false,
    },
    syncScrollMode: ['leftFollowRight', 'rightFollowLeft'],
};

export const MarkdownEditor = ({
    markdownRenderer = defaultMarkdownRenderer,
    options = {},
    name,
    value,
    onChange,
    className,
}) => {
    const handleChange = ({ text }) => {
        onChange(text);
    };

    ReactMarkdownEditor.use(AccessibleFonts);

    return (
        <div className={className}>
            <ReactMarkdownEditor
                name={name}
                value={value}
                renderHTML={markdownRenderer}
                config={{ ...defaultOptions, ...options }}
                onChange={handleChange}
                plugins={[
                    'header',
                    'accessible-fonts',
                    'table',
                    'image',
                    'link',
                    'clear',
                    'logger',
                    'mode-toggle',
                ]}
            />
        </div>
    );
};
