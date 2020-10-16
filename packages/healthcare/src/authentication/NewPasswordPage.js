import React from 'react';
import {
    NewPasswordForm,
    NewPasswordVerifyingToken,
    NewPasswordInvalidToken,
    NewPasswordSuccess,
    useSetNewPassword,
} from 'layer7-apihub';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';

import { AuthenticationLayout } from './AuthenticationLayout';

export function NewPasswordPage(props) {
    const classes = useStyles(props);
    const [state, handleSubmit] = useSetNewPassword();

    return (
        <AuthenticationLayout>
            <Grid container className={classes.content}>
                <Grid item xs={4} className={classes.form}>
                    <Typography component="h1" variant="h4" gutterBottom>
                        New Password
                    </Typography>
                    <Card className={classes.newPassword}>
                        {state === 'verifying_token' && (
                            <NewPasswordVerifyingToken {...props} />
                        )}
                        {state === 'request_new_password' && (
                            <>
                                <Typography
                                    gutterBottom
                                    className={classes.instructions}
                                >
                                    Please fill this form to create a new
                                    password.
                                </Typography>
                                <NewPasswordForm
                                    onSubmit={handleSubmit}
                                    toolbarProps={{
                                        button: {
                                            color: 'secondary',
                                            variant: 'contained',
                                            size: 'medium',
                                        },
                                    }}
                                    {...props}
                                />
                            </>
                        )}
                        {state === 'invalid_token' && (
                            <NewPasswordInvalidToken {...props} />
                        )}
                        {state === 'success' && (
                            <NewPasswordSuccess {...props} />
                        )}
                    </Card>
                </Grid>
            </Grid>
        </AuthenticationLayout>
    );
}

const useStyles = makeStyles(theme => ({
    content: {
        marginTop: theme.spacing(8),
        flex: 1,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    instructions: {
        paddingBottom: theme.spacing(4),
    },
    newPassword: {
        padding: theme.spacing(6),
    },
}));
