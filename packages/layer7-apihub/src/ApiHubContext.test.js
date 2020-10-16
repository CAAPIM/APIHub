import { guessApihubUrl, guessApihubTenantName } from './ApiHubContext';

describe('ApiHubContext', () => {
    describe('guessApihubUrl', () => {
        let windowSpy;

        beforeEach(() => {
            windowSpy = jest.spyOn(global, 'window', 'get');
        });

        afterEach(() => {
            windowSpy.mockRestore();
        });

        test('should return the current url', () => {
            const location = {
                origin: 'https://hello.marmelab.com',
            };

            const expectedResult = 'https://hello.marmelab.com';
            const result = guessApihubUrl(location);

            expect(result).toEqual(expectedResult);
        });

        test('should call window.location by default', () => {
            windowSpy.mockImplementation(() => ({
                location: {
                    origin: 'https://hello.marmelab.com',
                },
            }));

            const expectedResult = 'https://hello.marmelab.com';
            const result = guessApihubUrl();

            expect(result).toEqual(expectedResult);
        });
    });

    describe('guessApihubTenantName', () => {
        let windowSpy;

        beforeEach(() => {
            windowSpy = jest.spyOn(global, 'window', 'get');
        });

        afterEach(() => {
            windowSpy.mockRestore();
        });

        test('should return the tenant name', () => {
            const location = {
                host: 'hello.marmelab.com',
            };

            const expectedResult = 'hello';
            const result = guessApihubTenantName(location);

            expect(result).toEqual(expectedResult);
        });

        test('should call window.location by default', () => {
            windowSpy.mockImplementation(() => ({
                location: { host: 'hello.marmelab.com' },
            }));

            const expectedResult = 'hello';
            const result = guessApihubTenantName();

            expect(result).toEqual(expectedResult);
        });
    });
});
