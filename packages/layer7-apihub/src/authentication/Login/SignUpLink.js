// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTranslate } from 'react-admin';

export const SignUpLink = props => {
    const { classes } = useStyles(props);
    const translate = useTranslate();

    return (
        <>
            <Typography
                variant="h2"
                className={classes.title}
                color="textSecondary"
            >
                {translate('apihub.login.actions.sign_up_title')}
            </Typography>
            <Button
                component={Link}
                to="/signup"
                variant="outlined"
            >
                {translate('apihub.login.actions.sign_up')}
            </Button>
        </>
    );
};

const useStyles = makeStyles({ name: 'Layer7LoginSignUpLink' })(
    theme => ({
        title: {
            fontSize: theme.typography.fontSize * 2,
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(2),
        },
    })
);
