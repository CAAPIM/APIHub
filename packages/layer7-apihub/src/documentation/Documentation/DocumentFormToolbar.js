// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useEffect, useState } from 'react';
import {
    Toolbar,
    SaveButton,
    useTranslate,
    ValidationError,
} from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useFormState } from 'react-hook-form';

export const DocumentFormToolbar = ({ error = null, onCancel = () => {} }) => {
    const { classes } = useStyles();
    const translate = useTranslate();
    const { isDirty } = useFormState();
    const [isPrompt, setIsPrompt] = useState(false);

    useEffect(() => {
        if (isPrompt) {
            const confirmation = window.confirm(
                translate('resources.documents.notifications.unsaved_changes')
            );
            if (confirmation) {
                setIsPrompt(false);
                window.history.go(-1);
            } else {
                setIsPrompt(false);
            }
        }
    }, [isPrompt]);

    const onCancelClick = () => {
        if (isDirty) {
            setIsPrompt(true);
        } else {
            onCancel();
        }
    };

    return (
        <>
            {error ? (
                <div className={classes.error}>
                    <Typography variant="body1" color="error">
                        <ValidationError error={error} />
                    </Typography>
                </div>
            ) : null}
            <Toolbar className={classes.toolbar}>
                <CancelButton onClick={onCancelClick} />
                <SaveButton
                    label="resources.documents.actions.save"
                    className={classes.saveButton}
                />
            </Toolbar>
        </>
    );
};

const CancelButton = ({ onClick, ...rest }) => {
    const translate = useTranslate();

    return (
        <Button variant="outlined" onClick={onClick} {...rest}>
            {translate('resources.documents.actions.cancel')}
        </Button>
    );
};

const useStyles = makeStyles({ name: 'Layer7DocumentFormToolbar' })(theme => ({
    toolbar: {
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
        padding: 0,
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(),
        minWidth: `calc(512px + ${theme.spacing(4)})`,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${theme.spacing(3)})`,
            minWidth: `calc(768px + ${theme.spacing(4)})`,
        },
    },
    saveButton: {
        marginLeft: theme.spacing(2),
    },
    error: {
        margin: theme.spacing(2),
    },
    success: {
        color: theme.palette.success.main,
        marginTop: theme.spacing(2),
    },
}));
