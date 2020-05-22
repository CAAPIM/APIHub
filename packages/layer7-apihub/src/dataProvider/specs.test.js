import { fetchUtils } from 'ra-core';

import { specsDataProvider } from './specs';

describe('dataProvider - specs', () => {
    describe('getOne', () => {
        test('should fetch the correct url for specs', async () => {
            fetchUtils.fetchJson = jest.fn().mockResolvedValue({
                json: {},
            });

            const { getOne } = specsDataProvider('https://marmelab.com');

            await getOne({ id: 'covfefe' });

            expect(
                fetchUtils.fetchJson
            ).toHaveBeenCalledWith(
                "https://marmelab.com/2.0/Apis('covfefe')/SpecContent",
                { credentials: 'include' }
            );
        });

        test('should use the api id as the spec id', async () => {
            fetchUtils.fetchJson = jest.fn().mockResolvedValue({
                json: {
                    swagger: 'blablabla',
                },
            });

            const { getOne } = specsDataProvider('https://marmelab.com');

            const result = await getOne({ id: 'covfefe' });

            expect(result.data.id).toBe('covfefe');
            expect(result.data.swagger).toBe('blablabla');
        });
    });
});
