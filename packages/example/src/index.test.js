import { shouldEnableMock } from './index';

describe('index', () => {
    describe('shouldEnableMock', () => {
        test('should enable mocks if the config variable is true', () => {
            const result = shouldEnableMock(true);
            expect(result).toBe(true);
        });

        test("should enable mocks if the config variable is 'true'", () => {
            const result = shouldEnableMock('true');
            expect(result).toBe(true);
        });

        test('should disable mocks if the config variable is a random string', () => {
            const result = shouldEnableMock('keke');
            expect(result).toBe(false);
        });

        test('should disable mocks if the config variable is false', () => {
            const result = shouldEnableMock(false);
            expect(result).toBe(false);
        });

        test("should disable mocks if the config variable is 'false'", () => {
            const result = shouldEnableMock('false');
            expect(result).toBe(false);
        });

        test('should disable mocks if the config variable is undefined', () => {
            const result = shouldEnableMock(undefined);
            expect(result).toBe(false);
        });

        test('should disable mocks if the config variable is null', () => {
            const result = shouldEnableMock(null);
            expect(result).toBe(false);
        });
    });
});
