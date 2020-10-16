import React from 'react';
import { SimpleForm } from 'react-admin';
import { required } from 'ra-core';
import { FORM_ERROR } from 'final-form';
import { makeStyles } from '@material-ui/core';

import { NewPasswordToolbar } from './NewPasswordToolbar';
import { PasswordInput } from '../../ui';
import { validatePassword } from '../validatePassword';

export const NewPasswordForm = props => {
    const { onSubmit, toolbarProps, ...rest } = props;

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
        <div className={classes.root}>
            <SimpleForm
                className={classes.form}
                save={onSubmit}
                toolbar={<NewPasswordToolbar {...toolbarProps} />}
                validate={validate}
                {...rest}
            >
                <PasswordInput
                    source="password"
                    label="apihub.new_password.fields.password"
                    fullWidth
                    variant="outlined"
                    validate={[required(), validatePassword]}
                    title="apihub.new_password.validation.tooltip_password"
                />
                <PasswordInput
                    source="confirm_password"
                    label="apihub.new_password.fields.confirm_password"
                    variant="outlined"
                    fullWidth
                    validate={required()}
                    title="apihub.new_password.validation.tooltip_password_confirm"
                />
            </SimpleForm>
        </div>
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {},
        form: {
            '& >:first-child': {
                padding: 0,
            },
            '& .ra-input': {
                marginTop: theme.spacing(2),
            },
        },
    }),
    {
        name: 'Layer7NewPasswordForm',
    }
);
