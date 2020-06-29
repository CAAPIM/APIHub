import React from 'react';
import {
    ResetPasswordForm,
    ResetPasswordConfirm,
    useResetPassword,
} from 'layer7-apihub';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';

import { AuthenticationLayout } from './AuthenticationLayout';

export const ResetPasswordPage = props => {
    const classes = useStyles(props);
    const [username, setUsername] = useResetPassword();

    const handleSubmit = ({ username }) => {
        setUsername(username);
    };

    return (
        <AuthenticationLayout>
            <Grid container className={classes.content}>
                <Grid item xs={4} className={classes.form}>
                    <Typography component="h1" variant="h4" gutterBottom>
                        Reset Password
                    </Typography>
                    <Card className={classes.resetPassword}>
                        {username ? (
                            <ResetPasswordConfirm {...props} />
                        ) : (
                            <>
                                <Typography gutterBottom>
                                    Please fill this form to reset your
                                    password.
                                </Typography>
                                <ResetPasswordForm
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
                    </Card>
                </Grid>
            </Grid>
        </AuthenticationLayout>
    );
};

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
    resetPassword: {
        padding: theme.spacing(6),
    },
}));
