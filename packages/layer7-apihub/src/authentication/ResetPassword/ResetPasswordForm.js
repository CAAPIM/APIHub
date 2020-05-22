import React from 'react';
import { required, SimpleForm, TextInput, useTranslate } from 'react-admin';
import { makeStyles, Typography } from '@material-ui/core';
import { ResetPasswordToolbar } from './ResetPasswordToolbar';

const useStyles = makeStyles(theme => ({
    form: {
        '& >:first-child': {
            padding: 0,
        },
    },
    title: {
        fontSize: theme.typography.fontSize * 2,
        marginBottom: theme.spacing(6),
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
    instructions: {
        fontSize: theme.typography.fontSize,
        fontWeight: theme.typography.fontWeightBold,
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
    description: {
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(6),
    },
}));

export const ResetPasswordForm = props => {
    const { onSubmit = () => {} } = props;
    const classes = useStyles(props);
    const translate = useTranslate();

    return (
        <>
            <Typography variant="h2" className={classes.title}>
                {translate('apihub.reset_password.title')}
            </Typography>

            <Typography variant="subtitle1" className={classes.instructions}>
                {translate('apihub.reset_password.form_details.instructions')}
            </Typography>

            <Typography variant="subtitle2" className={classes.description}>
                {translate('apihub.reset_password.form_details.description')}
            </Typography>

            <SimpleForm
                className={classes.form}
                save={onSubmit}
                toolbar={<ResetPasswordToolbar />}
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
        </>
    );
};
