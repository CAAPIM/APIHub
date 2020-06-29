import {
    fetchAccountData,
    submitAccountData,
    checkUsernameUnicity,
} from './useAccountData';

describe('useAccountData', () => {
    describe('fetchAccountData', () => {
        test('should call the server', async () => {
            global.fetch = jest.fn().mockResolvedValue(
                Promise.resolve({
                    status: 200,
                    text: () => Promise.resolve({}),
                    json: () =>
                        Promise.resolve({
                            email: 'adrien.amoros@gmail.com',
                        }),
                })
            );

            const url = 'https://marmelab.com/api';
            const token = 'amazingtoken';

            await fetchAccountData(url, 'origin', token);

            expect(global.fetch.mock.calls[0][0]).toEqual(
                'https://marmelab.com/api/admin/accountSetup?token=amazingtoken'
            );
        });

        test('should return the server response if query is a success', async () => {
            global.fetch = jest.fn().mockResolvedValue(
                Promise.resolve({
                    status: 200,
                    text: () =>
                        Promise.resolve(
                            JSON.stringify({
                                email: 'adrien.amoros@gmail.com',
                            })
                        ),
                })
            );

            const data = await fetchAccountData();

            expect(data.email).toEqual('adrien.amoros@gmail.com');
        });

        test('should throw an error containing the server error if query is not a success', async () => {
            global.fetch = jest.fn().mockResolvedValue(
                Promise.resolve({
                    status: 400,
                    statusText: 'Bad Request',
                    text: () => Promise.resolve({}),
                })
            );

            await expect(fetchAccountData()).rejects.toThrow('Bad Request');
        });
    });

    describe('submitAccountData', () => {
        test('should call the server', async () => {
            global.fetch = jest.fn().mockResolvedValue(
                Promise.resolve({
                    status: 200,
                    text: () => Promise.resolve({}),
                    json: () =>
                        Promise.resolve({
                            email: 'adrien.amoros@gmail.com',
                        }),
                })
            );

            const url = 'https://marmelab.com/api';
            const token = 'amazingtoken';
            const data = {
                email: 'adrien.amoros@gmail.com',
            };

            await submitAccountData(url, 'origin', token, data);

            expect(global.fetch.mock.calls[0][0]).toEqual(
                'https://marmelab.com/api/admin/accountSetup?token=amazingtoken'
            );
            expect(global.fetch.mock.calls[0][1]).toMatchObject({
                method: 'put',
                body: JSON.stringify({
                    token: 'amazingtoken',
                    email: 'adrien.amoros@gmail.com',
                }),
            });
        });

        test('should return the server response if query is a success', async () => {
            global.fetch = jest.fn().mockResolvedValue(
                Promise.resolve({
                    status: 200,
                    text: () =>
                        Promise.resolve(
                            JSON.stringify({
                                email: 'adrien.amoros@gmail.com',
                            })
                        ),
                })
            );

            const response = await submitAccountData('', '');

            expect(response.email).toEqual('adrien.amoros@gmail.com');
        });

        test('should throw an error containing the server error if query is not a success', async () => {
            global.fetch = jest.fn().mockResolvedValue(
                Promise.resolve({
                    status: 400,
                    statusText: 'Bad Request',
                    text: () => Promise.resolve({}),
                })
            );

            await expect(submitAccountData()).rejects.toThrow('Bad Request');
        });
    });

    describe('checkUsernameUnicity', () => {
        test('should call the server', async () => {
            global.fetch = jest.fn().mockResolvedValue(
                Promise.resolve({
                    status: 200,
                    text: () =>
                        Promise.resolve(
                            JSON.stringify({
                                status: 200,
                            })
                        ),
                })
            );

            const url = 'https://marmelab.com/api';
            const username = 'Luwangel';

            await checkUsernameUnicity(url, 'origin', username);

            expect(global.fetch.mock.calls[0][0]).toEqual(
                `https://marmelab.com/api/admin/Portal.svc/UserNameUnique()?Name='Luwangel'`
            );
        });

        test('should return the server response if query is a success', async () => {
            global.fetch = jest.fn().mockResolvedValue(
                Promise.resolve({
                    status: 200,
                    text: () =>
                        Promise.resolve(
                            JSON.stringify({
                                status: 200,
                            })
                        ),
                })
            );

            const url = 'https://marmelab.com/api';
            const username = 'Luwangel';

            const response = await checkUsernameUnicity(
                url,
                'origin',
                username
            );

            expect(response.status).toEqual(200);
        });

        test('should throw an error containing the server error if query is not a success', async () => {
            global.fetch = jest.fn().mockResolvedValue(
                Promise.resolve({
                    status: 400,
                    statusText: 'Bad Request',
                    text: () => Promise.resolve({}),
                })
            );

            await expect(checkUsernameUnicity()).rejects.toThrow('Bad Request');
        });
    });
});
