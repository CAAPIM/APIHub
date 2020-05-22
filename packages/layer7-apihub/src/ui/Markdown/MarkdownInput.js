import React from 'react';
import { Labeled, InputHelperText, useInput } from 'react-admin';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';

import {
    MarkdownEditor,
    markdownRenderer as defaultMarkdownRenderer,
} from './';

const useStyles = makeStyles({
    editor: {
        '& .rc-md-editor': {
            width: '100%',
            height: '40vh',
        },
    },
});

export const MarkdownInput = ({
    markdownRenderer = defaultMarkdownRenderer,
    options = {},
    helperText,
    formClassName,
    className,
    ...rest
}) => {
    const classes = useStyles(rest);

    const {
        input: { onChange, value, name },
        meta: { error, touched },
    } = useInput({
        ...rest,
    });

    return (
        <Labeled
            className={classNames(formClassName, className)}
            {...rest}
            id="textarea"
        >
            <div className={classes.editor}>
                <MarkdownEditor
                    name={name}
                    value={value}
                    markdownRenderer={markdownRenderer}
                    options={options}
                    onChange={onChange}
                />
                <FormHelperText error={!!error} variant="filled" margin="dense">
                    <InputHelperText
                        touched={touched}
                        error={error}
                        helperText={helperText}
                    />
                </FormHelperText>
            </div>
        </Labeled>
    );
};
