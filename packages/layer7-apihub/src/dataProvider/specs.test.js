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
                "https://marmelab.com/2.0/Apis('covfefe')/SpecContent",
                { credentials: 'include' }
            );
        });

        test('should use the api id as the spec id', async () => {
            const fetchJson = jest.fn().mockResolvedValue({
                json: {
                    swagger: 'blablabla',
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
