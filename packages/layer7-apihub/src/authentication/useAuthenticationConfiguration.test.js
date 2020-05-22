import { fetchAuthenticationConfiguration } from './useAuthenticationConfiguration';

describe('useAuthenticationConfiguration', () => {
    describe('fetchAuthenticationConfiguration', () => {
        test('should return signUpEnabled as truthy if enabled in the server response', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                json: () =>
                    Promise.resolve({
                        REGISTRATION_REQUEST_WORKFLOW: 'ENABLED',
                    }),
            });

            const configuration = await fetchAuthenticationConfiguration();

            expect(configuration).toEqual({
                signUpEnabled: true,
                simpleCredentialsEnabled: false,
                ssoEnabled: false,
                termsOfUse: '',
            });
        });

        test('should return signUpEnabled as falsy if not enabled in the server response', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                json: () =>
                    Promise.resolve({
                        REGISTRATION_REQUEST_WORKFLOW: 'DISABLED',
                    }),
            });

            const configuration = await fetchAuthenticationConfiguration();

            expect(configuration).toEqual({
                signUpEnabled: false,
                simpleCredentialsEnabled: false,
                ssoEnabled: false,
                termsOfUse: '',
            });
        });

        test('should return simpleCredentialsEnabled as truthy if enabled in the server response', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                json: () =>
                    Promise.resolve({
                        REGISTRATION_STATUS: 'ENABLED',
                    }),
            });

            const configuration = await fetchAuthenticationConfiguration();

            expect(configuration).toEqual({
                signUpEnabled: false,
                simpleCredentialsEnabled: true,
                ssoEnabled: false,
                termsOfUse: '',
            });
        });

        test('should return simpleCredentialsEnabled as falsy if not enabled in the server response', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                json: () =>
                    Promise.resolve({
                        REGISTRATION_STATUS: 'DISABLED',
                    }),
            });

            const configuration = await fetchAuthenticationConfiguration();

            expect(configuration).toEqual({
                signUpEnabled: false,
                simpleCredentialsEnabled: false,
                ssoEnabled: false,
                termsOfUse: '',
            });
        });

        test('should return ssoEnabled as truthy if enabled in the server response', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                json: () =>
                    Promise.resolve({
                        SSO_ENABLED: 'true',
                    }),
            });

            const configuration = await fetchAuthenticationConfiguration();

            expect(configuration).toEqual({
                signUpEnabled: false,
                simpleCredentialsEnabled: false,
                ssoEnabled: true,
                termsOfUse: '',
            });
        });

        test('should return ssoEnabled as falsy if not enabled in the server response', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                json: () =>
                    Promise.resolve({
                        SSO_ENABLED: 'false',
                    }),
            });

            const configuration = await fetchAuthenticationConfiguration();

            expect(configuration).toEqual({
                signUpEnabled: false,
                simpleCredentialsEnabled: false,
                ssoEnabled: false,
                termsOfUse: '',
            });
        });

        test('should return ssoEnabled as falsy if not enabled in the server response', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                json: () =>
                    Promise.resolve({
                        SSO_ENABLED: 'false',
                    }),
            });

            const configuration = await fetchAuthenticationConfiguration();

            expect(configuration).toEqual({
                signUpEnabled: false,
                simpleCredentialsEnabled: false,
                ssoEnabled: false,
                termsOfUse: '',
            });
        });

        test('should return termsOfUse if they are present in the server response', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                json: () =>
                    Promise.resolve({
                        REGISTRATION_TERMS_OF_USE: 'terms',
                    }),
            });

            const configuration = await fetchAuthenticationConfiguration();

            expect(configuration).toEqual({
                signUpEnabled: false,
                simpleCredentialsEnabled: false,
                ssoEnabled: false,
                termsOfUse: 'terms',
            });
        });

        test('should return termsOfUse as empty string if not present in the server response', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                json: () => Promise.resolve({}),
            });

            const configuration = await fetchAuthenticationConfiguration();

            expect(configuration).toEqual({
                signUpEnabled: false,
                simpleCredentialsEnabled: false,
                ssoEnabled: false,
                termsOfUse: '',
            });
        });
    });
});
