// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState, useEffect, forwardRef } from 'react';
import { useTranslate } from 'react-admin';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { makeStyles } from 'tss-react/mui';
import SaveIcon from '@mui/icons-material/Save';

import { MarkdownEditor } from '../ui';

export const ApplicationDetailsOverviewEditor = ({
    initialValue,
    onCancel,
    onSave,
    open,
}) => {
    const { classes } = useStyles();
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
                />
            </DialogContent>
            <DialogActions className={classes.actions}>
                <Button
                    variant="outlined"
                    onClick={handleCancel}
                >
                    {translate('resources.applications.actions.cancel')}
                </Button>
                <Button
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

const useStyles = makeStyles({ name: 'Layer7ApplicationDetailsOverviewEditor' })(
    theme => ({
        editor: {
            height: `calc(100% - ${theme.spacing(2)})`,
        },
        actions: {
            margin: theme.spacing(2),
        },
    })
);
