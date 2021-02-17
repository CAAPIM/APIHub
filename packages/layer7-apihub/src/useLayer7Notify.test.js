import { getErrorMessage, useLayer7Notify } from './useLayer7Notify';

describe('useLayer7Notify', () => {
    describe('getErrorMessage', () => {
        test('should return validatonMessage if error body has userErrorMessage', () => {
            const errorMessage = getErrorMessage({
                body: {
                    userErrorMessage: 'userErrorMessage string',
                },
            });

            expect(errorMessage).toBe('userErrorMessage string');
        });

        test('should return validatonMessage if error body has message.value', () => {
            const errorMessage = getErrorMessage({
                body: {
                    error: {
                        message: {
                            value: 'value string',
                        },
                    },
                },
            });

            expect(errorMessage).toBe('value string');
        });

        test('should return validatonMessage if error body has validationErrors', () => {
            const errorMessage = getErrorMessage({
                body: {
                    validationErrors: {
                        field1: {
                            error: 'error string',
                        },
                        field2: {
                            localizedMessage: 'localizedMessage string',
                        },
                    },
                },
            });

            expect(errorMessage).toBe('error string localizedMessage string');
        });

        test('should return validatonMessage if error body has detail.validationErrors', () => {
            const errorMessage = getErrorMessage({
                body: {
                    error: {
                        detail: {
                            validationErrors: {
                                field1: {
                                    error: 'error string',
                                },
                                field2: {
                                    localizedMessage: 'localizedMessage string',
                                },
                            },
                        },
                    },
                },
            });

            expect(errorMessage).toBe('error string localizedMessage string');
        });
    });

    describe('useLayer7Notify', () => {
        test.skip('should trigger a notification successfully', () => {
            // TODO: test useNotify()
        });
    });
});
