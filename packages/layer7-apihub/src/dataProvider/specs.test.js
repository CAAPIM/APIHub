// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { specsDataProvider } from './specs';

describe('dataProvider - specs', () => {
    describe('getOne', () => {
        test('should fetch the correct url for specs', async () => {
            const fetchJson = jest.fn().mockResolvedValue({
                json: {},
            });

            const { getOne } = specsDataProvider({
                apiUrl: 'https://marmelab.com',
                fetchJson,
            });

            await getOne({ id: 'covfefe' });

            expect(
                fetchJson
            ).toHaveBeenCalledWith(
                'https://marmelab.com/api-management/1.0/apis/covfefe/assets/swagger',
                { credentials: 'include' }
            );
        });

        test('should use the api id as the spec id', async () => {
            const fetchJson = jest.fn().mockResolvedValue({
                json: {
                    content: '{\n "swagger": "blablabla" }',
                },
            });

            const { getOne } = specsDataProvider({
                apiUrl: 'https://marmelab.com',
                fetchJson,
            });

            const result = await getOne({ id: 'covfefe' });

            expect(result.data.id).toBe('covfefe');
            expect(result.data.swagger).toBe('blablabla');
        });
    });
});
