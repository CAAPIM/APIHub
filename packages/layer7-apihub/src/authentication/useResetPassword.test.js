// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { fetchResetPassword } from './useResetPassword';

describe('useResetPassword', () => {
    describe('fetchResetPassword', () => {
        test('should call the server', async () => {
            global.fetch = jest.fn().mockResolvedValue(
                Promise.resolve({
                    status: 200,
                    text: () =>
                        Promise.resolve(JSON.stringify({ status: 200 })),
                })
            );

            const url = 'https://marmelab.com/api/apim';
            const username = 'Luwangel';

            await fetchResetPassword(url, 'origin', username);

            expect(global.fetch.mock.calls[0][0]).toEqual(
                `https://marmelab.com/api/apim/reset-my-password`
            );
        });

        test('should return the server response if query is a success', async () => {
            global.fetch = jest.fn().mockResolvedValue(
                Promise.resolve({
                    status: 200,
                    text: () =>
                        Promise.resolve(JSON.stringify({ status: 200 })),
                })
            );

            const response = await fetchResetPassword();

            expect(response.status).toEqual(200);
        });

        test('should throw an error containing the server error if query is not a success', async () => {
            global.fetch = jest.fn().mockResolvedValue(
                Promise.resolve({
                    status: 400,
                    statusText: 'Bad Request',
                    text: () => Promise.resolve(JSON.stringify({})),
                })
            );

            await expect(fetchResetPassword()).rejects.toThrow('Bad Request');
        });
    });
});
