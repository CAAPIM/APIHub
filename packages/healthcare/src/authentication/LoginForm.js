import React, { useState } from 'react';
import {
    PasswordInput,
    required,
    FormWithRedirect,
    TextInput,
    useLogin,
    useTranslate,
} from 'react-admin';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export const LoginForm = props => {
    const login = useLogin();
    const classes = useStyles(props);
    const translate = useTranslate();
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState(null); // eslint-disable-line no-unused-vars

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
        <FormWithRedirect
            className={classes.form}
            save={submit}
            render={({ handleSubmit, handleSubmitWithRedirect }) => (
                <form onSubmit={handleSubmit}>
                    <TextInput
                        source="username"
                        type="text"
                        label="apihub.login.fields.username"
                        variant="filled"
                        fullWidth
                        validate={required()}
                    />
                    <PasswordInput
                        source="password"
                        label="apihub.login.fields.password"
                        variant="filled"
                        fullWidth
                        validate={required()}
                    />
                    <div className={classes.actions}>
                        <Button
                            type="submit"
                            color="secondary"
                            variant="contained"
                            disabled={isLoading}
                            onClick={handleSubmitWithRedirect}
                        >
                            Login
                        </Button>
                        <Typography variant="body1">
                            <Link component={RouterLink} to="/reset-password">
                                {translate(
                                    'apihub.login.actions.forgot_password'
                                )}
                            </Link>
                        </Typography>
                    </div>
                </form>
            )}
        />
    );
};

const useStyles = makeStyles(theme => ({
    form: {
        '& >:first-child': {
            padding: 0,
        },
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
}));
