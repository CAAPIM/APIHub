// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { SaveButton, Toolbar, ValidationError } from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import get from 'lodash/get';

/**
 * The SignUp Toolbar displaying the submit button and the possible errors of signup form
 *
 * @param {string} button.color The color of the submit button
 * @param {string} button.variant The variant of the submit button
 * @param {string} button.size The size of the submit button
 *
 */
export const SignUpToolbar = props => {
    const { loading = false, error = null, ...rest } = props;
    const { classes } = useStyles(rest);

    const { button } = props;
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
            <Toolbar className={classes.toolbar} {...rest}>
                <SaveButton
                    icon={
                        loading ? (
                            <CircularProgress
                                className={classes.circularProgress}
                                size={15}
                            />
                        ) : (
                            <span />
                        )
                    }
                    label="resources.registrations.actions.submit"
                    color={color}
                    variant={variant}
                    size={size}
                />
            </Toolbar>
        </>
    );
};

const useStyles = makeStyles({ name: 'Layer7SignUpToolbar' })(
    theme => ({
        toolbar: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            flexBasis: '100%',
            backgroundColor: 'transparent',
            padding: 0,
        },
        circularProgress: {
            color: theme.palette.grey[500],
        },
    })
);
