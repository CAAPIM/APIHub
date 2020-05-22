import React from 'react';
import { Toolbar, SaveButton, useTranslate } from 'react-admin';
import { ValidationError } from 'ra-core';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { DocumentFormConfirmBeforeQuit } from './DocumentFormConfirmBeforeQuit';

const useStyles = makeStyles(theme => ({
    toolbar: {
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
        padding: 0,
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(),
        minWidth: `calc(512px + ${theme.spacing(4)}px)`,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${theme.spacing(3)}px)`,
            minWidth: `calc(768px + ${theme.spacing(4)}px)`,
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

export const DocumentFormToolbar = ({
    loading = false,
    error = null,
    onCancel = () => {},
    pristine,
    ...rest
}) => {
    const classes = useStyles();

    return (
        <>
            <DocumentFormConfirmBeforeQuit when={!pristine} />
            {error ? (
                <div className={classes.error}>
                    <Typography variant="body1" color="error">
                        <ValidationError error={error} />
                    </Typography>
                </div>
            ) : null}
            <Toolbar className={classes.toolbar} pristine={pristine} {...rest}>
                <CancelButton onClick={onCancel} />
                <SaveButton
                    label="resources.documents.actions.save"
                    className={classes.saveButton}
                    saving={loading}
                />
            </Toolbar>
        </>
    );
};

const CancelButton = ({
    basePath,
    handleSubmit,
    handleSubmitWithRedirect,
    onSave,
    invalid,
    pristine,
    submitOnEnter,
    onClick,
    ...rest
}) => {
    const translate = useTranslate();

    return (
        <Button color="primary" variant="outlined" onClick={onClick} {...rest}>
            {translate('resources.documents.actions.cancel')}
        </Button>
    );
};
