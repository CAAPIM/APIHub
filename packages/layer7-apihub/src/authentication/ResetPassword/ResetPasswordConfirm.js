import React from 'react';
import { useTranslate } from 'react-admin';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

export const ResetPasswordConfirm = props => {
    const classes = useStyles(props);
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
                color="primary"
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

const useStyles = makeStyles(
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
    }),
    {
        name: 'Layer7ResetPasswordConfirm',
    }
);
