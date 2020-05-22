import React from 'react';
import { SaveButton, Toolbar } from 'react-admin';
import { ValidationError } from 'ra-core';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { FormSpy } from 'react-final-form';

const useStyles = makeStyles(theme => ({
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
}));

const subscription = { error: true, touched: true, submitSucceeded: true };

export const NewPasswordToolbar = props => {
    const classes = useStyles(props);

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
                                icon={<span />}
                                label="apihub.new_password.actions.change_password"
                            />
                        </Toolbar>
                    </>
                );
            }}
        </FormSpy>
    );
};
