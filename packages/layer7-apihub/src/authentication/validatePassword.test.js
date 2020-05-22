import expect from 'expect';
import { validatePassword } from './validatePassword';

describe('validatePassword', () => {
    test('should require at least 8 characters', () => {
        expect(validatePassword('1234567')).toEqual({
            args: { min: 8 },
            message: 'ra.validation.minLength',
        });
    });
    test('should require at most 60 characters', () => {
        const password = Array.from(Array(61).keys())
            .map(() => 'a')
            .join('');

        expect(validatePassword(password)).toEqual({
            args: { max: 60 },
            message: 'ra.validation.maxLength',
        });
    });

    test('should require at least 1 lowercase character', () => {
        expect(validatePassword('AAAAAAAAA')).toEqual({
            args: { pattern: /[a-z]+/ },
            message:
                'apihub.validation.password.at_least_one_lowercase_character',
        });
    });

    test('should require at least 1 lowercase character', () => {
        expect(validatePassword('aaaaaaaaa')).toEqual({
            args: { pattern: /[A-Z]+/ },
            message:
                'apihub.validation.password.at_least_one_uppercase_character',
        });
    });

    test('should require at least 1 number', () => {
        expect(validatePassword('aaaaaaaaA')).toEqual({
            args: { pattern: /\d+/ },
            message: 'apihub.validation.password.at_least_one_number',
        });
    });

    test('should require at least 1 special character', () => {
        expect(validatePassword('aaaaaaaaA1')).toEqual({
            args: { pattern: /[!@#$%^&*-]+/ },
            message:
                'apihub.validation.password.at_least_one_special_character',
        });
    });

    test('should accept a valid password', () => {
        expect(validatePassword('aaaaaaaaA1@')).toEqual(undefined);
    });
});
