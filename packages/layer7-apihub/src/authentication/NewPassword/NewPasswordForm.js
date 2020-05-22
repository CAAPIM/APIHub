import React from 'react';
import { SimpleForm } from 'react-admin';
import { required } from 'ra-core';
import { makeStyles } from '@material-ui/core';
import { FORM_ERROR } from 'final-form';

import { NewPasswordToolbar } from './NewPasswordToolbar';
import { PasswordInput } from '../../ui';
import { validatePassword } from '../validatePassword';

const useStyles = makeStyles(theme => ({
    form: {
        '& >:first-child': {
            padding: 0,
        },
        '& .ra-input': {
            marginTop: theme.spacing(2),
        },
    },
}));

export const NewPasswordForm = props => {
    const { onSubmit } = props;
    const classes = useStyles(props);

    const validate = ({ password, confirm_password }) => {
        if (password !== confirm_password) {
            return {
                [FORM_ERROR]:
                    'apihub.new_password.validation.error_password_match',
            };
        }
    };

    return (
        <SimpleForm
            className={classes.form}
            save={onSubmit}
            toolbar={<NewPasswordToolbar />}
            validate={validate}
            {...props}
        >
            <PasswordInput
                source="password"
                label="apihub.new_password.fields.password"
                fullWidth
                validate={[required(), validatePassword]}
                title="apihub.new_password.validation.tooltip_password"
            />
            <PasswordInput
                source="confirm_password"
                label="apihub.new_password.fields.confirm_password"
                fullWidth
                validate={required()}
                title="apihub.new_password.validation.tooltip_password_confirm"
            />
        </SimpleForm>
    );
};
