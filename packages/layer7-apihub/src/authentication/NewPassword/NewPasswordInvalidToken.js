// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useTranslate } from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

export const NewPasswordInvalidToken = props => {
    const translate = useTranslate();
    const { classes } = useStyles(props);

    return (
        <div className={classes.root}>
            <Typography className={classes.title} variant="body1" gutterBottom>
                {translate('apihub.new_password.notifications.invalid_token')}
            </Typography>
            <Button
                className={classes.button}
                variant="contained"
                component={Link}
                to="/login"
            >
                {translate('apihub.new_password.actions.open_login_page')}
            </Button>
        </div>
    );
};

const useStyles = makeStyles({ name: 'Layer7NewPasswordInvalidToken' })(
    theme => ({
        root: {},
        title: {
            color: theme.palette.error.main,
        },
        button: {},
    })
);
