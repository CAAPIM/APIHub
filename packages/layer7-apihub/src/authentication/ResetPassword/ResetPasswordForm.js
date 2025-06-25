// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState } from 'react';
import { required, SimpleForm, TextInput, useTranslate } from 'react-admin';
import { Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { ResetPasswordToolbar } from './ResetPasswordToolbar';

export const ResetPasswordForm = props => {
    const { handleSubmit, localLoginsDisabled, toolbarProps, ...rest } = props;
    const { classes } = useStyles(rest);
    const translate = useTranslate();
    const [error, setError] = useState(null);

    const onSubmit = ({ username }) => {
        if (localLoginsDisabled) {
            setError(
                'apihub.reset_password.notifications.local_logins_disabled'
            );
        } else {
            handleSubmit(username);
        }
    };

    return (
        <div className={classes.root}>
            <Typography
                variant="subtitle1"
                color="textSecondary"
                className={classes.instructions}
            >
                {translate('apihub.reset_password.form_details.instructions')}
            </Typography>
            <Typography
                variant="subtitle2"
                color="textSecondary"
                className={classes.description}
                gutterBottom
            >
                {translate('apihub.reset_password.form_details.description')}
            </Typography>
            <SimpleForm
                sanitizeEmptyValues={true}
                className={classes.form}
                error={error}
                onSubmit={onSubmit}
                toolbar={
                    <ResetPasswordToolbar error={error} {...toolbarProps} />
                }
                {...rest}
            >
                <TextInput
                    source="username"
                    type="text"
                    label="apihub.reset_password.fields.username"
                    variant="outlined"
                    fullWidth
                    validate={required()}
                    autoFocus
                />
            </SimpleForm>
        </div>
    );
};

const useStyles = makeStyles({ name: 'Layer7ResetPasswordForm' })(
    theme => ({
        root: {},
        instructions: {
            paddingTop: theme.spacing(2),
            fontSize: theme.typography.fontSize,
            fontWeight: theme.typography.fontWeightBold,
        },
        description: {
            paddingBottom: theme.spacing(2),
        },
        form: {
            '& >:first-child': {
                padding: 0,
            },
        },
    })
);
