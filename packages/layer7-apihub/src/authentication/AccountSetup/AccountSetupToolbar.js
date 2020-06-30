import React from 'react';
import { SaveButton, Toolbar } from 'react-admin';
import { ValidationError } from 'ra-core';
import { makeStyles, Typography } from '@material-ui/core';
import { FormSpy } from 'react-final-form';
import get from 'lodash/get';

/**
 * The Account Setup Toolbar displaying the submit button and the possible errors of the account setup form
 *
 * @param {string} button.color The color of the submit button
 * @param {string} button.variant The variant of the submit button
 * @param {string} button.size The size of the submit button
 *
 */
export const AccountSetupToolbar = props => {
    const classes = useStyles(props);

    const { button } = props;
    const color = get(button, 'color', 'primary');
    const variant = get(button, 'variant', 'outlined');
    const size = get(button, 'size', 'small');

    return (
        <FormSpy subscription={subscription}>
            {({ error, touched }) => {
                const showError =
                    error && touched.password && touched.confirm_password;

                return (
                    <>
                        {showError ? (
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
                                label="apihub.account_setup.actions.submit"
                                color={color}
                                variant={variant}
                                size={size}
                            />
                        </Toolbar>
                    </>
                );
            }}
        </FormSpy>
    );
};

const useStyles = makeStyles(
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
        error: {
            marginTop: theme.spacing(2),
        },
        success: {
            color: theme.palette.success.main,
            marginTop: theme.spacing(2),
        },
        submit: {},
    }),
    {
        name: 'Layer7AccountSetupToolbar',
    }
);

const subscription = { error: true, touched: true, submitSucceeded: true };
