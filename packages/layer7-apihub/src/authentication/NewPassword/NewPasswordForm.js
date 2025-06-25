// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { SimpleForm, useTranslate, required } from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import get from 'lodash/get';

import { useApiHub } from '../../ApiHubContext';
import { NewPasswordToolbar } from './NewPasswordToolbar';
import { PasswordInput } from '../../ui';
import {
    fetchPasswordPolicyData,
    getPwdTooltip,
    getPasswordValidators,
} from '../validatePassword';

export const NewPasswordForm = props => {
    const { onSubmit, toolbarProps, ...rest } = props;

    const { classes } = useStyles(props);

    const validate = ({ password, confirm_password }) => {
        const errors = {};
        if (password !== confirm_password) {
            errors.password =
                'apihub.new_password.validation.error_password_match';
        }
        return errors;
    };

    const [passwordPolicyData, setPasswordPolicyData] = React.useState({});
    const { urlWithTenant, originHubName } = useApiHub();
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
    const translate = useTranslate();
    const passwordTooltip = getPwdTooltip(regexConfig, translate);

    return (
        <div className={classes.root}>
            <SimpleForm
                sanitizeEmptyValues={true}
                className={classes.form}
                onSubmit={onSubmit}
                toolbar={<NewPasswordToolbar {...toolbarProps} />}
                validate={validate}
                {...rest}
            >
                <PasswordInput
                    source="password"
                    label="apihub.new_password.fields.password"
                    fullWidth
                    variant="outlined"
                    validate={[required(), ...getPasswordValidators(regexStr)]}
                    title={passwordTooltip}
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

const useStyles = makeStyles({ name: 'Layer7NewPasswordForm' })(theme => ({
    root: {},
    form: {
        '& >:first-child': {
            padding: 0,
        },
        '& .ra-input': {
            marginTop: theme.spacing(2),
        },
    },
}));
