import { getAuthSchemes } from './useAuthSchemes';

describe('useAuthSchemes', () => {
    describe('getAuthSchemes', () => {
        test('should only return alternative schemes', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                text: () =>
                    Promise.resolve(
                        JSON.stringify({
                            respCode: 200,
                            respMsg:
                                'Successfully fetched Authentication Schemes',
                            authSchemes: [
                                {
                                    defaultConfig: true,
                                    description: 'description one',
                                    name: 'name one',
                                    uuid: 'uuid one',
                                },
                                {
                                    defaultConfig: false,
                                    description: 'description two',
                                    name: 'name two',
                                    uuid: 'uuid two',
                                },
                            ],
                        })
                    ),
            });

            const authSchemes = await getAuthSchemes();

            expect(authSchemes).toEqual([
                {
                    defaultConfig: false,
                    description: 'description two',
                    name: 'name two',
                    uuid: 'uuid two',
                },
            ]);
        });
    });
});
