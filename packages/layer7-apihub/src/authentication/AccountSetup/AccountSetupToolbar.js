// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { SaveButton, Toolbar, ValidationError } from 'react-admin';
import { Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import get from 'lodash/get';
import { useFormContext } from 'react-hook-form';

/**
 * The Account Setup Toolbar displaying the submit button and the possible errors of the account setup form
 *
 * @param {string} button.color The color of the submit button
 * @param {string} button.variant The variant of the submit button
 * @param {string} button.size The size of the submit button
 *
 */
export const AccountSetupToolbar = props => {
    const { classes } = useStyles(props);

    const { button } = props;
    const color = get(button, 'color', 'primary');
    const variant = get(button, 'variant', 'outlined');
    const size = get(button, 'size', 'small');
    const { getFieldState } = useFormContext();
    const passwordFieldState = getFieldState('password');
    const confirmPasswordFieldState = getFieldState('confirm_password');
    const showError =
        passwordFieldState &&
        passwordFieldState.isTouched &&
        confirmPasswordFieldState.isTouched;

    return (
        <>
            <Toolbar className={classes.toolbar} {...props}>
                <SaveButton
                    className={classes.submit}
                    icon={<span />}
                    label="apihub.account_setup.actions.submit"
                    color={color}
                    variant={variant}
                    size={size}
                />
            </Toolbar>
        </>
    );
};

const useStyles = makeStyles({ name: 'Layer7AccountSetupToolbar' })(theme => ({
    toolbar: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        flexBasis: '100%',
        backgroundColor: 'transparent',
        padding: 0,
        marginTop: theme.spacing(2),
    },
    error: {
        marginTop: theme.spacing(2),
    },
    success: {
        color: theme.palette.success.main,
        marginTop: theme.spacing(2),
    },
    submit: {},
}));
