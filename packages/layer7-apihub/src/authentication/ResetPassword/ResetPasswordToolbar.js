import React from 'react';
import { SaveButton, Toolbar } from 'react-admin';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    toolbar: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        flexBasis: '100%',
        backgroundColor: 'transparent',
        padding: 0,
    },
});

export const ResetPasswordToolbar = props => {
    const classes = useStyles(props);

    return (
        <Toolbar className={classes.toolbar} {...props}>
            <SaveButton
                icon={<span />}
                label="apihub.reset_password.actions.submit"
            />
        </Toolbar>
    );
};
