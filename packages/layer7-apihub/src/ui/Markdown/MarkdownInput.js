// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { Labeled, InputHelperText, useInput } from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import FormHelperText from '@mui/material/FormHelperText';

import { MarkdownEditor } from './';

export const MarkdownInput = ({
    helperText,
    formClassName,
    className,
    ...rest
}) => {
    const { classes, cx } = useStyles(rest);

    const {
        field: { onChange, value, name },
        fieldState: { error, isTouched },
    } = useInput({
        ...rest,
    });

    return (
        <Labeled
            className={cx(formClassName, className)}
            {...rest}
            id="textarea"
        >
            <div className={classes.editor}>
                <MarkdownEditor name={name} value={value} onChange={onChange} />
                <FormHelperText error={!!error} variant="filled" margin="dense">
                    <InputHelperText
                        touched={isTouched}
                        error={error?.message}
                        helperText={helperText}
                    />
                </FormHelperText>
            </div>
        </Labeled>
    );
};

const useStyles = makeStyles({ name: 'Layer7MarkdownInput' })({
    editor: {
        width: '100%',
        height: '40vh',
        '& code': {
            whiteSpace: 'pre-wrap',
        },
    },
});
