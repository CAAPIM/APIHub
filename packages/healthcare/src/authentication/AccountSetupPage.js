import React from 'react';
import {
    AccountSetupForm,
    AccountSetupPreparingForm,
    AccountSetupInvalidRequest,
    AccountSetupSuccess,
    useAccountData,
} from 'layer7-apihub';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';

import { AuthenticationLayout } from './AuthenticationLayout';

export const AccountSetupPage = props => {
    const [state, accountData, submitAccountData] = useAccountData();
    const classes = useStyles(props);

    const handleSubmit = data => {
        submitAccountData(data);
    };

    return (
        <AuthenticationLayout>
            <Grid container className={classes.content}>
                <Grid item xs={4} className={classes.form}>
                    <Typography component="h1" variant="h4" gutterBottom>
                        Account Setup
                    </Typography>
                    <Card className={classes.accountSetup}>
                        {state === 'prepare' && (
                            <AccountSetupPreparingForm {...props} />
                        )}
                        {state === 'fill' && (
                            <>
                                <Typography gutterBottom>
                                    Please fill this form to complete your
                                    registration.
                                </Typography>
                                <AccountSetupForm
                                    initialValues={accountData}
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
                        {state === 'invalid_request' && (
                            <AccountSetupInvalidRequest {...props} />
                        )}
                        {state === 'success' && (
                            <AccountSetupSuccess {...props} />
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
    accountSetup: {
        padding: theme.spacing(6),
    },
}));
