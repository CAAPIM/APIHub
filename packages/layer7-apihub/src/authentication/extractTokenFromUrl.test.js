import { extractTokenFromUrl } from './extractTokenFromUrl';

describe('extractTokenFromUrl', () => {
    test('should return the extracted new password token from the url', () => {
        expect(
            extractTokenFromUrl(
                'https://apim.apim-44-demo.lvn.broadcom.net/admin/app/new-password#token/MzhiMWIzOTEtYmZjNC00N2Y5LTliNjAtZWM2NTRkODAyZDA4'
            )
        ).toEqual('MzhiMWIzOTEtYmZjNC00N2Y5LTliNjAtZWM2NTRkODAyZDA4');
    });

    test('should return null if no new password token can be extracted from the url', () => {
        expect(
            extractTokenFromUrl(
                'https://apim.apim-44-demo.lvn.broadcom.net/admin/app/new-password'
            )
        ).toEqual(null);
    });
});
