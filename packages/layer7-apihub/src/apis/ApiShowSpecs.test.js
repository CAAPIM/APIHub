import { isSoapApi } from './ApiShow';

describe('ApiShow', () => {
    describe('isSoapApi', () => {
        test('should return true if apiServiceType is soap', () => {
            const record = {
                apiServiceType: 'soap',
                ssgServiceType: undefined,
            };

            expect(isSoapApi(record)).toBe(true);
        });

        test('should return true if ssgServiceType is soap', () => {
            const record = {
                apiServiceType: undefined,
                ssgServiceType: 'soap',
            };

            expect(isSoapApi(record)).toBe(true);
        });

        test('should accept uppercase and lowercase values for the apiServiceType', () => {
            const recordMixed = {
                apiServiceType: 'SoAp',
                ssgServiceType: undefined,
            };

            expect(isSoapApi(recordMixed)).toBe(true);

            const recordLowercase = {
                apiServiceType: 'soap',
                ssgServiceType: undefined,
            };

            expect(isSoapApi(recordLowercase)).toBe(true);

            const recordUppercase = {
                apiServiceType: 'SOAP',
                ssgServiceType: undefined,
            };

            expect(isSoapApi(recordUppercase)).toBe(true);
        });

        test('should accept uppercase and lowercase values for the ssgServiceType', () => {
            const recordMixed = {
                apiServiceType: undefined,
                ssgServiceType: 'SoAp',
            };

            expect(isSoapApi(recordMixed)).toBe(true);

            const recordLowercase = {
                apiServiceType: undefined,
                ssgServiceType: 'soap',
            };

            expect(isSoapApi(recordLowercase)).toBe(true);

            const recordUppercase = {
                apiServiceType: undefined,
                ssgServiceType: 'SOAP',
            };

            expect(isSoapApi(recordUppercase)).toBe(true);
        });

        test('should return false if both apiServiceType and ssgServiceType are not soap', () => {
            const record = {
                apiServiceType: 'rest',
                ssgServiceType: 'rest',
            };

            expect(isSoapApi(record)).toBe(false);
        });
    });
});
