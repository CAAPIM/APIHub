// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useTranslate } from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

export const ResetPasswordConfirm = props => {
    const { classes } = useStyles(props);
    const translate = useTranslate();

    return (
        <div className={classes.root}>
            <Typography className={classes.title} variant="body1" gutterBottom>
                {translate('apihub.reset_password_confirm.title')}
            </Typography>
            <Typography
                variant="subtitle1"
                color="textSecondary"
                className={classes.instructions}
            >
                {translate(
                    'apihub.reset_password_confirm.form_details.instructions'
                )}
            </Typography>
            <Typography
                variant="subtitle2"
                color="textSecondary"
                className={classes.description}
            >
                {translate(
                    'apihub.reset_password_confirm.form_details.description'
                )}
            </Typography>
            <Button
                className={classes.button}
                variant="contained"
                component={Link}
                to="/login"
            >
                {translate(
                    'apihub.reset_password_confirm.actions.open_login_page'
                )}
            </Button>
        </div>
    );
};

const useStyles = makeStyles({ name: 'Layer7ResetPasswordConfirm' })(
    theme => ({
        root: {},
        title: {
            marginBottom: theme.spacing(6),
        },
        instructions: {
            fontWeight: theme.typography.fontWeightBold,
        },
        description: {
            color: theme.palette.text.secondary,
            marginBottom: theme.spacing(6),
        },
        button: {},
    })
);
