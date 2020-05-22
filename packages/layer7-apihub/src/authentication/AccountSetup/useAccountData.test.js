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
                    json: () =>
                        Promise.resolve({
                            email: 'adrien.amoros@gmail.com',
                        }),
                })
            );

            const url = 'https://marmelab.com/api';
            const token = 'amazingtoken';

            await fetchAccountData(url, token);

            expect(global.fetch).toHaveBeenCalledWith(
                'https://marmelab.com/api/admin/accountSetup?token=amazingtoken'
            );
        });

        test('should return the server response if query is a success', async () => {
            global.fetch = jest.fn().mockResolvedValue(
                Promise.resolve({
                    status: 200,
                    json: () =>
                        Promise.resolve({
                            email: 'adrien.amoros@gmail.com',
                        }),
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

            await submitAccountData(url, token, data);

            expect(global.fetch).toHaveBeenCalledWith(
                'https://marmelab.com/api/admin/accountSetup?token=amazingtoken',
                {
                    method: 'put',
                    body: {
                        token: 'amazingtoken',
                        email: 'adrien.amoros@gmail.com',
                    },
                }
            );
        });

        test('should return the server response if query is a success', async () => {
            global.fetch = jest.fn().mockResolvedValue(
                Promise.resolve({
                    status: 200,
                    json: () =>
                        Promise.resolve({
                            email: 'adrien.amoros@gmail.com',
                        }),
                })
            );

            const response = await submitAccountData();

            expect(response.email).toEqual('adrien.amoros@gmail.com');
        });

        test('should throw an error containing the server error if query is not a success', async () => {
            global.fetch = jest.fn().mockResolvedValue(
                Promise.resolve({
                    status: 400,
                    statusText: 'Bad Request',
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
                    json: () =>
                        Promise.resolve({
                            status: 200,
                        }),
                })
            );

            const url = 'https://marmelab.com/api';
            const username = 'Luwangel';

            await checkUsernameUnicity(url, username);

            expect(global.fetch).toHaveBeenCalledWith(
                `https://marmelab.com/api/admin/Portal.svc/UserNameUnique()?Name='Luwangel'`
            );
        });

        test('should return the server response if query is a success', async () => {
            global.fetch = jest.fn().mockResolvedValue(
                Promise.resolve({
                    status: 200,
                    json: () =>
                        Promise.resolve({
                            status: 200,
                        }),
                })
            );

            const url = 'https://marmelab.com/api';
            const username = 'Luwangel';

            const response = await checkUsernameUnicity(url, username);

            expect(response.status).toEqual(200);
        });

        test('should throw an error containing the server error if query is not a success', async () => {
            global.fetch = jest.fn().mockResolvedValue(
                Promise.resolve({
                    status: 400,
                    statusText: 'Bad Request',
                })
            );

            await expect(checkUsernameUnicity()).rejects.toThrow('Bad Request');
        });
    });
});
