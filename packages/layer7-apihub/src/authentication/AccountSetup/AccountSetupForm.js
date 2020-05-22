import React from 'react';
import {
    required,
    minLength,
    maxLength,
    SimpleForm,
    TextInput,
    useTranslate,
} from 'react-admin';
import { makeStyles, Typography, InputAdornment } from '@material-ui/core';
import { InfoOutlined } from '@material-ui/icons';
import { FORM_ERROR } from 'final-form';

import { useApiHub } from '../../ApiHubContext';
import { HtmlTooltip, PasswordInput } from '../../ui';
import { TermsInput } from './TermsInput';
import { AccountSetupToolbar } from './AccountSetupToolbar';
import { validatePassword } from '../validatePassword';
import { checkUsernameUnicity } from './useAccountData';

const mustBeTrue = () => value =>
    !value
        ? 'apihub.account_setup.terms_of_use.terms_of_use_validation'
        : undefined;

const checkUnicity = url => async value => {
    if (value.length < 6) {
        return;
    }

    try {
        await checkUsernameUnicity(url, value);
    } catch {
        return 'apihub.account_setup.validation.error_username_not_unique';
    }
};

const useStyles = makeStyles(theme => ({
    form: {
        '& >:first-child': {
            padding: 0,
        },
        '& .ra-input': {
            marginTop: theme.spacing(2),
        },
    },
    title: {
        fontSize: theme.typography.fontSize * 2,
        marginBottom: theme.spacing(6),
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
}));

export const AccountSetupForm = ({ initialValues, onSubmit }) => {
    const classes = useStyles();
    const translate = useTranslate();
    const { url } = useApiHub();

    const validate = ({ password, confirm_password }) => {
        if (password !== confirm_password) {
            return {
                [FORM_ERROR]:
                    'apihub.account_setup.validation.error_password_match',
            };
        }
    };

    return (
        <>
            <Typography variant="h2" className={classes.title}>
                {translate('apihub.account_setup.title')}
            </Typography>

            <SimpleForm
                className={classes.form}
                save={onSubmit}
                toolbar={<AccountSetupToolbar />}
                validate={validate}
                initialValues={initialValues}
            >
                <TextInput
                    source="firstName"
                    type="text"
                    label="apihub.account_setup.fields.firstname"
                    variant="outlined"
                    fullWidth
                    validate={required()}
                />
                <TextInput
                    source="lastName"
                    type="text"
                    label="apihub.account_setup.fields.lastname"
                    variant="outlined"
                    fullWidth
                    validate={required()}
                />
                <TextInput
                    source="email"
                    type="email"
                    label="apihub.account_setup.fields.email"
                    variant="outlined"
                    fullWidth
                    validate={required()}
                    disabled
                />
                <TextInput
                    source="userName"
                    type="text"
                    label="apihub.account_setup.fields.username"
                    variant="outlined"
                    autoComplete="new_username"
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <HtmlTooltip
                                    className={classes.tootip}
                                    title={translate('apihub.tooltip_username')}
                                    placement="right"
                                    arrow
                                >
                                    <InfoOutlined />
                                </HtmlTooltip>
                            </InputAdornment>
                        ),
                    }}
                    validate={[
                        required(),
                        minLength(6),
                        maxLength(60),
                        checkUnicity(url),
                    ]}
                />
                <PasswordInput
                    source="password"
                    label="apihub.account_setup.fields.password"
                    variant="outlined"
                    autoComplete="new_password"
                    fullWidth
                    validate={[required(), validatePassword]}
                    title="apihub.account_setup.validation.tooltip_password"
                />
                <PasswordInput
                    source="confirm_password"
                    label="apihub.account_setup.fields.confirm_password"
                    variant="outlined"
                    autoComplete="confirm_new_password"
                    fullWidth
                    validate={[required()]}
                    title="apihub.account_setup.validation.tooltip_password_confirm"
                />
                <TermsInput
                    source="terms"
                    type="checkbox"
                    validate={[mustBeTrue()]}
                />
            </SimpleForm>
        </>
    );
};
