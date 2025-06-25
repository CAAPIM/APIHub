// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { SaveButton, Toolbar, ValidationError } from 'react-admin';
import { Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import get from 'lodash/get';

/**
 * The Reset Password Toolbar displaying the submit button
 *
 * @param {string} button.color The color of the submit button
 * @param {string} button.variant The variant of the submit button
 * @param {string} button.size The size of the submit button
 *
 */
export const ResetPasswordToolbar = props => {
    const { classes } = useStyles(props);

    const { button } = props;
    const { error } = props;
    const color = get(button, 'color', 'primary');
    const variant = get(button, 'variant', 'outlined');
    const size = get(button, 'size', 'small');

    return (
        <>
            {error ? (
                <Typography
                    variant="body1"
                    color="error"
                    className={classes.error}
                >
                    <ValidationError error={error} />
                </Typography>
            ) : null}
            <Toolbar className={classes.toolbar} {...props}>
                <SaveButton
                    className={classes.submit}
                    icon={<span />}
                    label="apihub.reset_password.actions.submit"
                    color={color}
                    variant={variant}
                    size={size}
                />
            </Toolbar>
        </>
    );
};

const useStyles = makeStyles({ name: 'Layer7ResetPasswordToolbar' })(
    theme => ({
        toolbar: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            flexBasis: '100%',
            backgroundColor: 'transparent',
            padding: 0,
            marginTop: theme.spacing(2),
        },
        submit: {},
    })
);
