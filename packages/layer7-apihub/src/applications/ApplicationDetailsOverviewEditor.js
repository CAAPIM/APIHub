import React, { useState, useEffect, forwardRef } from 'react';
import { useTranslate } from 'ra-core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';

import {
    MarkdownEditor,
    markdownRenderer as defaultMarkdownRenderer,
} from '../ui';

export const ApplicationDetailsOverviewEditor = ({
    initialValue,
    markdownRenderer = defaultMarkdownRenderer,
    onCancel,
    onSave,
    open,
}) => {
    const classes = useStyles();
    const [value, setValue] = useState(initialValue);
    const translate = useTranslate();

    useEffect(() => {
        // Be sure the value is updated when the initialValue changed
        setValue(initialValue);
    }, [initialValue]);

    const handleSave = () => {
        onSave(value);
    };

    const handleCancel = () => {
        setValue(initialValue);
        onCancel();
    };

    return (
        <Dialog
            open={open}
            fullScreen
            onClose={handleCancel}
            TransitionComponent={Transition}
        >
            <DialogTitle>
                {translate('resources.applications.fields.overview')}
            </DialogTitle>
            <DialogContent>
                <MarkdownEditor
                    className={classes.editor}
                    value={value}
                    onChange={setValue}
                    markdownRenderer={markdownRenderer}
                />
            </DialogContent>
            <DialogActions className={classes.actions}>
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleCancel}
                >
                    {translate('resources.applications.actions.cancel')}
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleSave}
                    startIcon={<SaveIcon />}
                >
                    {translate('resources.applications.actions.save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(
    theme => ({
        editor: {
            height: `calc(100% - ${theme.spacing(2)}px)`,
        },
        actions: {
            margin: theme.spacing(2),
        },
    }),
    {
        name: 'Layer7ApplicationDetailsOverviewEditor',
    }
);
