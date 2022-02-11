import { getAuthSchemes } from './useAuthSchemes';

describe('useAuthSchemes', () => {
    describe('getAuthSchemes', () => {
        let windowSpy;
        beforeEach(() => {
            windowSpy = jest.spyOn(global, 'window', 'get');
        });

        afterEach(() => {
            windowSpy.mockRestore();
        });

        test('should only return all non-default auth schemes when isOktaProxied is false', async () => {
            windowSpy.mockImplementation(() => ({
                location: {
                    href: 'https://apim.dev.ca.com/admin',
                },
            }));
            global.fetch = jest.fn().mockResolvedValue({
                text: () =>
                    Promise.resolve(
                        JSON.stringify({
                            respCode: 200,
                            respMsg:
                                'Successfully fetched Authentication Schemes',
                            isOktaProxied: false,
                            authSchemes: [
                                {
                                    authMethod: 'DEFAULT',
                                    defaultConfig: true,
                                    description: 'description one',
                                    name: 'name one',
                                    uuid: 'uuid one',
                                },
                                {
                                    authMethod: 'SAML',
                                    defaultConfig: false,
                                    description: 'description two',
                                    name: 'name two',
                                    uuid: 'uuid two',
                                    url: '',
                                },
                                {
                                    authMethod: 'SOME_AUTH',
                                    defaultConfig: false,
                                    description: 'description three',
                                    name: 'name three',
                                    uuid: 'uuid three',
                                },
                            ],
                        })
                    ),
            });

            const authSchemes = await getAuthSchemes();

            expect(authSchemes).toEqual([
                [
                    {
                        authMethod: 'SAML',
                        defaultConfig: false,
                        description: 'description two',
                        name: 'name two',
                        uuid: 'uuid two',
                        url: '?fromUrl=https%3A%2F%2Fapim.dev.ca.com%2Fadmin',
                    },
                    {
                        authMethod: 'SOME_AUTH',
                        defaultConfig: false,
                        description: 'description three',
                        name: 'name three',
                        uuid: 'uuid three',
                    },
                ],
                false,
            ]);
        });

        test('should return OKTA authscheme in place of all SAML auth schemes when isOktaProxied is true', async () => {
            windowSpy.mockImplementation(() => ({
                location: {
                    href: 'https://remote-apihub.ca.com',
                },
            }));
            global.fetch = jest.fn().mockResolvedValue({
                text: () =>
                    Promise.resolve(
                        JSON.stringify({
                            respCode: 200,
                            respMsg:
                                'Successfully fetched Authentication Schemes',
                            isOktaProxied: true,
                            authSchemes: [
                                {
                                    defaultConfig: true,
                                    description: 'description one',
                                    name: 'name one',
                                    uuid: 'uuid one',
                                    authMethod: 'DEFAULT',
                                },
                                {
                                    defaultConfig: false,
                                    description: 'description two',
                                    name: 'name two',
                                    uuid: 'uuid two',
                                    authMethod: 'SAML',
                                },
                                {
                                    defaultConfig: false,
                                    description: 'description three',
                                    name: 'name three',
                                    uuid: 'uuid three',
                                    authMethod: 'SOME_AUTH',
                                },
                                {
                                    defaultConfig: false,
                                    description: 'description four',
                                    name: 'name four',
                                    uuid: 'uuid four',
                                    authMethod: 'SAML',
                                },
                            ],
                        })
                    ),
            });

            const authSchemes = await getAuthSchemes('https://apim.dev.ca.com');

            expect(authSchemes).toEqual([
                [
                    {
                        authMethod: 'SOME_AUTH',
                        defaultConfig: false,
                        description: 'description three',
                        name: 'name three',
                        uuid: 'uuid three',
                    },
                    {
                        uuid: '',
                        name: 'SSO Login',
                        description: '',
                        showFyp: false,
                        credsReqd: false,
                        defaultConfig: false,
                        url:
                            'https://apim.dev.ca.com/admin/login?fromApiHub=true&fromUrl=https%3A%2F%2Fremote-apihub.ca.com',
                        tenantId: '',
                        authMethod: 'SAML',
                        links: [],
                    },
                ],
                false,
            ]);
        });
    });
});
