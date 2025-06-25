// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { Fragment, useEffect, useState } from 'react';
import {
    SaveButton,
    Toolbar,
    useTranslate,
    ValidationError,
} from 'react-admin';
import { Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import get from 'lodash/get';
import Button from '@mui/material/Button';
import { useFormContext } from 'react-hook-form';

/**
 * The Application Toolbar displaying the submit button and the possible errors of the account setup form
 *
 * @param {string} button.color The color of the submit button
 * @param {string} button.variant The variant of the submit button
 * @param {string} button.size The size of the submit button
 *
 */
export const ApplicationToolbar = props => {
    const { classes } = useStyles(props);

    const {
        button,
        buttonLabel,
        onPublish = () => {},
        showPublishBtn,
        onCancel = () => {},
        disableSaveButton = false,
        disablePublishButton = false,
    } = props;
    const color = get(button, 'color', 'primary');
    const variant = 'text';
    const size = get(button, 'size', 'large');
    const translate = useTranslate();
    const { getFieldState } = useFormContext();
    const { error, isTouched } = getFieldState('applicationName');
    const showError = error && isTouched;
    const [isDisableSaveButton, setIsDisableSaveButton] = useState(false);
    useEffect(() => {
        setIsDisableSaveButton(disableSaveButton);
    }, [disableSaveButton]);
    return (
        <>
            {showError ? (
                <Typography
                    variant="body1"
                    color="error"
                    className={classes.error}
                >
                    <ValidationError error={error?.message} />
                </Typography>
            ) : null}
            <Toolbar className={classes.toolbar} {...props}>
                {onCancel && (
                    <Button
                        className={classes.publish}
                        onClick={onCancel}
                        variant={variant}
                        size={size}
                    >
                        {translate('resources.applications.actions.cancel')}
                    </Button>
                )}
                {showPublishBtn && (
                    <Button
                        className={classes.publish}
                        data-apim-test="publish"
                        disabled={disablePublishButton}
                        onClick={onPublish}
                        variant={variant}
                        size={size}
                    >
                        {translate('resources.applications.actions.publish')}
                    </Button>
                )}
                <SaveButton
                    className={classes.submit}
                    disabled={isDisableSaveButton}
                    icon={<span />}
                    label={buttonLabel}
                    color={color}
                    variant={variant}
                    size={size}
                />
            </Toolbar>
        </>
    );
};

const useStyles = makeStyles({ name: 'Layer7ApplicationToolbar' })(theme => ({
    toolbar: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'right',
        flexBasis: '100%',
        paddingBottom: theme.spacing(2),
        paddingRight: theme.spacing(8),
        marginTop: theme.spacing(2),
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '100%',
        backgroundColor: '#3f51b5',
    },
    error: {
        marginTop: theme.spacing(2),
    },
    success: {
        color: theme.palette.success.main,
        marginTop: theme.spacing(2),
    },
    submit: {
        color: 'white',
    },
    publish: {
        color: 'white',
        marginRight: 16,
    },
}));
