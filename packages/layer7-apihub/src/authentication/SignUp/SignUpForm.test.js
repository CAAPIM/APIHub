import { validateAreEqual } from './SignUpForm';

describe('validateAreEqual', () => {
    test('should return undefined if the specified fields are equal', () => {
        expect(
            validateAreEqual('email', 'emailConfirmation')('test@test.com', {
                email: 'test@test.com',
                emailConfirmation: 'test@test.com',
            })
        ).toEqual(undefined);
    });
    test('should return the default error message if the specified fields are not equal', () => {
        expect(
            validateAreEqual('email', 'emailConfirmation')('test@test.com', {
                email: 'test@test.com',
                emailConfirmation: 'test@test.fr',
            })
        ).toEqual(
            'resources.registrations.notifications.email_confirmation_error'
        );
    });
    test('should return the specified error message if the specified fields are not equal', () => {
        expect(
            validateAreEqual(
                'email',
                'emailConfirmation',
                'booo'
            )('test@test.com', {
                email: 'test@test.com',
                emailConfirmation: 'test@test.fr',
            })
        ).toEqual('booo');
    });
});
