import { composeValidators, maxLength, minLength, regex } from 'ra-core';

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
]);
