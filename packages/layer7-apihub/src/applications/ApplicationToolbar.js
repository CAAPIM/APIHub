import React, { Fragment } from 'react';
import { SaveButton, Toolbar } from 'react-admin';
import { useTranslate, ValidationError } from 'ra-core';
import { makeStyles, Typography } from '@material-ui/core';
import { FormSpy } from 'react-final-form';
import get from 'lodash/get';
import Button from '@material-ui/core/Button';

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
                            {onCancel && (
                                <Button
                                    className={classes.publish}
                                    onClick={onCancel}
                                    variant={variant}
                                    size={size}
                                >
                                    {translate(
                                        'resources.applications.actions.cancel'
                                    )}
                                </Button>
                            )}
                            {showPublishBtn && (
                                <Button
                                    className={classes.publish}
                                    disabled={disablePublishButton}
                                    onClick={onPublish}
                                    variant={variant}
                                    size={size}
                                >
                                    {translate(
                                        'resources.applications.actions.publish'
                                    )}
                                </Button>
                            )}
                            <SaveButton
                                className={classes.submit}
                                disabled={disableSaveButton}
                                icon={<span />}
                                label={buttonLabel}
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
    }),
    {
        name: 'Layer7ApplicationToolbar',
    }
);

const subscription = { error: true, touched: true, submitSucceeded: true };
