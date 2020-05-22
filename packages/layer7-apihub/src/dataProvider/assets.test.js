import { fetchUtils } from 'ra-core';

import { assetsDataProvider } from './assets';

describe('dataProvider - assets', () => {
    describe('getManyReference', () => {
        test('should fetch the correct url for assets', async () => {
            fetchUtils.fetchJson = jest.fn().mockResolvedValue({
                json: [],
            });

            const { getManyReference } = assetsDataProvider(
                'https://marmelab.com'
            );

            await getManyReference({ id: 'covfefe' });

            expect(
                fetchUtils.fetchJson
            ).toHaveBeenCalledWith(
                'https://marmelab.com/api-management/1.0/apis/covfefe/assets',
                { credentials: 'include' }
            );
        });
    });
});
