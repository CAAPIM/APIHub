import React from 'react';
import { SaveButton, Toolbar } from 'react-admin';
import { ValidationError } from 'ra-core';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
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
}));

export const LoginToolbar = ({ loading = false, error = null, ...rest }) => {
    const classes = useStyles(rest);

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
                    label="apihub.login.actions.sign_in"
                    disabled={loading}
                />
            </Toolbar>
        </>
    );
};
