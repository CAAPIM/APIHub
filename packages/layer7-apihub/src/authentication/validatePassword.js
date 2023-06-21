import { composeValidators, maxLength, minLength, regex } from 'ra-core';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import { getFetchJson } from '../fetchUtils';

export const validatePassword = composeValidators([
    minLength(8),
    maxLength(60),
    regex(
        /[a-z]+/,
        'apihub.validation.password.at_least_one_lowercase_character'
    ),
    regex(
        /[A-Z]+/,
        'apihub.validation.password.at_least_one_uppercase_character'
    ),
    regex(/\d+/, 'apihub.validation.password.at_least_one_number'),
    regex(
        /[!@#$%^&*-]+/,
        'apihub.validation.password.at_least_one_special_character'
    ),
    regex(
        /^[\da-zA-Z!@#$%^&*-]*$/,
        'apihub.validation.password.no_other_characters_accepted'
    ),
]);

export const fetchPasswordPolicyData = async (url, originHubName) => {
    const fetchJson = getFetchJson(originHubName);
    const pwdPolicyPath = `${url}/public/auth/schemes/passwordpolicy`;
    const { json } = await fetchJson(pwdPolicyPath);
    return get(json, 'authScheme.passwordPolicies', {});
};

export const getPasswordValidators = regexStr => {
    if (regexStr) {
        return [
            regex(
                new RegExp(regexStr),
                'resources.userProfiles.validation.error_password_not_matching_criteria'
            ),
        ];
    }
    return [];
};

export const getPwdTooltip = (regConfig, translate) => {
    if (!regConfig) return '';
    const rulesTypes = {
        MINIMUM_LENGTH: 'tooltip_password_min',
        MAXIMUM_LENGTH: 'tooltip_password_max',
        LOWERCASE: 'tooltip_password_lower',
        UPPERCASE: 'tooltip_password_upper',
        NUMBER: 'tooltip_password_number',
    };
    const messages = [];
    messages.push(
        translate('resources.userProfiles.validation.tooltip_password_title')
    );
    forEach(rulesTypes, (msgId, type) => {
        const configObj = regConfig[type];
        if (configObj && configObj.enabled) {
            messages.push(
                translate(`resources.userProfiles.validation.${msgId}`, {
                    num: configObj.value,
                })
            );
        }
    });
    if (regConfig && regConfig['SYMBOL'] && regConfig['SYMBOL'].enabled) {
        messages.push(
            translate(
                'resources.userProfiles.validation.tooltip_password_special',
                {
                    num: regConfig['SYMBOL'].value,
                    symbols: regConfig['SUPPORTED_SYMBOLS'].value,
                }
            )
        );
    }
    return messages.join('\n');
};
