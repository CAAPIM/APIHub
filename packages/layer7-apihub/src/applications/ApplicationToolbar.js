import React from 'react';
import { SaveButton, EditButton, Toolbar } from 'react-admin';
import { ValidationError } from 'ra-core';
import { makeStyles, Typography } from '@material-ui/core';
import { FormSpy } from 'react-final-form';
import get from 'lodash/get';

/**
 * The Application Toolbar displaying the submit button and the possible errors of the account setup form
 *
 * @param {string} button.color The color of the submit button
 * @param {string} button.variant The variant of the submit button
 * @param {string} button.size The size of the submit button
 *
 */
export const ApplicationToolbar = props => {
    const classes = useStyles(props);

    const { button, type, buttonLabel } = props;
    const color = get(button, 'color', 'primary');
    const variant = get(button, 'variant', 'contained');
    const size = get(button, 'size', 'large');
    const isEdit = type === 'EDIT';
    return (
        <FormSpy subscription={subscription}>
            {({ error, touched }) => {
                const showError = error && touched.applicationName;

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
                            {/* {isEdit ? (
                                <EditButton
                                    className={classes.submit}
                                    icon={<span />}
                                    label="resources.applications.actions.save"
                                    color={color}
                                    variant={variant}
                                    size={size}
                                />
                            ) : ( */}
                            <SaveButton
                                className={classes.submit}
                                icon={<span />}
                                label={buttonLabel}
                                color={color}
                                variant={variant}
                                size={size}
                            />
                            {/* )} */}
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
            alignItems: 'flex-end',
            justifyContent: 'center',
            flexBasis: '100%',
            paddingRight: theme.spacing(2),
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
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
        name: 'Layer7ApplicationToolbar',
    }
);

const subscription = { error: true, touched: true, submitSucceeded: true };
