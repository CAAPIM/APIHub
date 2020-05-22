import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useTranslate } from 'ra-core';

import { SignUpForm } from './SignUpForm';
import { AuthenticationLayout } from '../AuthenticationLayout';

export const SignUpPage = props => {
    const { Layout = AuthenticationLayout } = props;
    const translate = useTranslate();
    const classes = useStyles();

    return (
        <Layout {...props}>
            <Typography variant="h2" className={classes.title}>
                {translate('resources.registrations.title')}
            </Typography>

            <SignUpForm />
        </Layout>
    );
};

const useStyles = makeStyles(theme => ({
    title: {
        fontSize: theme.typography.fontSize * 2,
        marginBottom: theme.spacing(6),
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
}));
