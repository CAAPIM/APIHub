import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { text } from '@storybook/addon-knobs';

import { MarkdownView, MarkdownEditor } from './';

const defaultMarkdown = `#### Default Markdown text

You can edit this **content** using the **Knobs panel** bellow!
`;

export default {
    title: 'UI/Markdown',
};

export const Default = () => {
    const content = text('Content', defaultMarkdown);

    return <MarkdownView value={content} />;
};

const defaultEditorMarkdown = `You can edit this **content** directly in **this markdown editor**!`;

const useStyles = makeStyles({
    editor: {
        '& .rc-md-editor': {
            width: '100%',
            height: '70vh',
        },
    },
});

export const Editor = () => {
    const classes = useStyles();

    const [content, setContent] = useState(defaultEditorMarkdown);

    return (
        <MarkdownEditor
            className={classes.editor}
            markdown={content}
            onChange={setContent}
        />
    );
};
