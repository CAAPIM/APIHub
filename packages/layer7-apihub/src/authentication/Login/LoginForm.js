import React, { useState } from 'react';
import {
    PasswordInput,
    required,
    SimpleForm,
    TextInput,
    useLogin,
    useTranslate,
} from 'react-admin';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, Link, Typography } from '@material-ui/core';
import { LoginToolbar } from './LoginToolbar';

const useStyles = makeStyles(theme => ({
    form: {
        '& >:first-child': {
            padding: 0,
        },
    },
}));

export const LoginForm = props => {
    const login = useLogin();
    const classes = useStyles(props);
    const translate = useTranslate();
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState(null);

    const submit = async ({ username, password }) => {
        setError(null);
        setIsLoading(true);

        try {
            await login({ scheme: 'credentials', username, password });
        } catch {
            setError('apihub.login.notifications.invalid_credentials');
        }

        setIsLoading(false);
    };

    return (
        <>
            <SimpleForm
                className={classes.form}
                save={submit}
                toolbar={<LoginToolbar loading={isLoading} error={error} />}
            >
                <TextInput
                    source="username"
                    type="text"
                    label="apihub.login.fields.username"
                    variant="outlined"
                    fullWidth
                    validate={required()}
                />
                <PasswordInput
                    source="password"
                    label="apihub.login.fields.password"
                    variant="outlined"
                    fullWidth
                    validate={required()}
                />
            </SimpleForm>

            <Typography variant="body1">
                <Link component={RouterLink} to="/reset-password">
                    {translate('apihub.login.actions.forgot_password')}
                </Link>
            </Typography>
        </>
    );
};
