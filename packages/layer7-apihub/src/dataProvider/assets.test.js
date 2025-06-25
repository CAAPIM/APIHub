// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { assetsDataProvider } from './assets';

describe('dataProvider - assets', () => {
    describe('getManyReference', () => {
        test('should fetch the correct url for assets', async () => {
            const fetchJson = jest.fn().mockResolvedValue({
                json: [],
            });

            const { getManyReference } = assetsDataProvider({
                apiUrl: 'https://marmelab.com',
                fetchJson,
            });

            await getManyReference({ id: 'covfefe' });

            expect(
                fetchJson
            ).toHaveBeenCalledWith(
                'https://marmelab.com/api-management/1.0/apis/covfefe/assets',
                { credentials: 'include' }
            );
        });
    });
});
