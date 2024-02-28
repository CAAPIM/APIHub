import React from 'react';
import Editor, { defaultCommands } from '@uiw/react-markdown-editor';
import { EditorView } from "@codemirror/view";
import GridOn from '@material-ui/icons/GridOn';
import keys from 'lodash/keys';
import map from 'lodash/map';
import { makeStyles } from '@material-ui/core';

export const MarkdownEditor = ({
    value = '',
    onChange,
}) => {

    const tableCmd = {
        name: "table",
        keyCommand: "table",
        buttonProps: { "aria-label": "Insert table" },
        icon: (
            <GridOn
                style={{
                    height: 14,
                    width: 14,
                }}
            />
        ),
        execute: ({ state, view }) => {
            if (!state || !view) return;
            const lineInfo = view.state.doc.lineAt(view.state.selection.main.from);
            const mark = `| Head | Head |\n| ---  | ---  |\n| Data | Data |\n| Data | Data |`;
            view.dispatch({
              changes: {
                from: lineInfo.from,
                to: lineInfo.to,
                insert: `${mark}`
              },
              // selection: EditorSelection.range(lineInfo.from + mark.length, lineInfo.to),
              selection: { anchor: lineInfo.from + mark.length },
            });
        },        
      };
    const toolsKeys = keys(defaultCommands).filter(key => key !== 'fullscreen' && key !== 'preview');
    const existingTools = map(toolsKeys, key => defaultCommands[key]);
    const rightSideTools = (defaultCommands && defaultCommands.preview) ? [defaultCommands.preview] : [];

    const classes = useStyles();

    return (
        <div>
            <Editor
                className={classes.editor}
                enableScroll
                extensions={[EditorView.lineWrapping]}
                height="300px"
                onChange={onChange}
                toolbars={[...existingTools, tableCmd]}
                toolbarsMode={rightSideTools}
                value={value}
                visible
            />
        </div>
    );
};

const useStyles = makeStyles(
    {
        editor: {
            backgroundColor: 'rgb(216, 222, 228)',
            '& .cm-content': {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '& ::selection': {
                    background: 'highlight !important',
                    color: 'highlighttext !important',
                },
            },
            '& .md-editor-preview': {
                backgroundColor: 'white',
            },
            '& .md-editor-toolbar-warp': {
                backgroundColor: 'lightGray',
            },
        },
    },
    {
        name: 'Layer7MarkdownEditor',
    }
);
