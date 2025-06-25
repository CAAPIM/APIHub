// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import {
    required,
    minLength,
    maxLength,
    SimpleForm,
    TextInput,
    useTranslate,
} from 'react-admin';
import { InputAdornment } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { InfoOutlined } from '@mui/icons-material';
import get from 'lodash/get';

import { useApiHub } from '../../ApiHubContext';
import { HtmlTooltip, PasswordInput } from '../../ui';
import { TermsInput } from './TermsInput';
import { AccountSetupToolbar } from './AccountSetupToolbar';
import {
    fetchPasswordPolicyData,
    getPwdTooltip,
    getPasswordValidators,
} from '../validatePassword';
import isEmpty from 'lodash/isEmpty';
import { getErrorMessage } from '../../useLayer7Notify';

export const AccountSetupForm = props => {
    const {
        initialValues,
        onSubmit,
        toolbarProps,
        error = {},
        ...rest
    } = props;
    const { classes } = useStyles(rest);
    const translate = useTranslate();
    const { urlWithTenant, originHubName } = useApiHub();
    const [passwordPolicyData, setPasswordPolicyData] = React.useState({});
    React.useEffect(() => {
        fetchPasswordPolicyData(urlWithTenant, originHubName)
            .then(data => {
                setPasswordPolicyData(data);
            })
            .catch(exception => {
                setPasswordPolicyData({});
            });
    }, [originHubName, urlWithTenant]);
    const regexConfig = get(passwordPolicyData, 'regexConfig', {});
    const regexStr = get(regexConfig, 'REGEX.value', '');
    const passwordTooltip = getPwdTooltip(regexConfig, translate);
    let flag = true;
    const validate = values => {
        const errors = {};
        if (!values.firstName) {
            errors.firstName = 'Required';
        }
        if (!values.lastName) {
            errors.lastName = 'Required';
        }
        if (!values.userName) {
            errors.userName = 'Required';
        }
        if (values.password !== values.confirm_password) {
            errors.password =
                'apihub.account_setup.validation.error_password_match';
        }
        const strReg = new RegExp(regexStr);
        if (!strReg.test(values.password)) {
            errors.password = passwordTooltip;
        }
        if (!strReg.test(values.confirm_password)) {
            errors.confirm_password = passwordTooltip;
        }
        if (!values.terms) {
            errors.terms =
                'apihub.account_setup.terms_of_use.terms_of_use_validation';
        }
        if (!isEmpty(error) && flag) {
            const message = getErrorMessage(error);
            flag = false;
            errors.userName = message;
        }
        return errors;
    };

    return (
        <div className={classes.root}>
            <SimpleForm
                className={classes.form}
                onSubmit={onSubmit}
                toolbar={<AccountSetupToolbar {...toolbarProps} />}
                validate={validate}
                defaultValues={initialValues}
                {...rest}
            >
                <TextInput
                    source="firstName"
                    type="text"
                    label="apihub.account_setup.fields.firstname"
                    variant="outlined"
                    validate={required()}
                    fullWidth
                />
                <TextInput
                    source="lastName"
                    type="text"
                    label="apihub.account_setup.fields.lastname"
                    variant="outlined"
                    validate={required()}
                    fullWidth
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
                                    title={translate(
                                        'apihub.account_setup.validation.tooltip_username'
                                    )}
                                    placement="right"
                                    arrow
                                >
                                    <InfoOutlined />
                                </HtmlTooltip>
                            </InputAdornment>
                        ),
                    }}
                    validate={[required(), minLength(6), maxLength(60)]}
                />
                <PasswordInput
                    source="password"
                    label="apihub.account_setup.fields.password"
                    variant="outlined"
                    autoComplete="new_password"
                    fullWidth
                    validate={[required(), ...getPasswordValidators(regexStr)]}
                    title={passwordTooltip}
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
                    validate={[required()]}
                />
            </SimpleForm>
        </div>
    );
};

const mustBeTrue = () => value =>
    !value
        ? 'apihub.account_setup.terms_of_use.terms_of_use_validation'
        : undefined;

const useStyles = makeStyles({ name: 'Layer7AccountSetupForm' })(theme => ({
    root: {},
    form: {
        '& >:first-child': {
            padding: 0,
        },
        '& .ra-input': {
            marginTop: theme.spacing(2),
        },
        paddingBottom: theme.spacing(4),
    },
}));
