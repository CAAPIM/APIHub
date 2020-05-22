import { fetchResetPassword } from './useResetPassword';

describe('useResetPassword', () => {
    describe('fetchResetPassword', () => {
        test('should call the server', async () => {
            global.fetch = jest.fn().mockResolvedValue(
                Promise.resolve({
                    status: 200,
                    json: () => Promise.resolve({ status: 200 }),
                })
            );

            const url = 'https://marmelab.com/api';
            const username = 'Luwangel';

            await fetchResetPassword(url, username);

            expect(global.fetch).toHaveBeenCalledWith(
                `https://marmelab.com/api/admin/Portal.svc/ResetMyPassword()?Username='Luwangel'`
            );
        });

        test('should return the server response if query is a success', async () => {
            global.fetch = jest.fn().mockResolvedValue(
                Promise.resolve({
                    status: 200,
                    json: () => Promise.resolve({ status: 200 }),
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
                })
            );

            await expect(fetchResetPassword()).rejects.toThrow('Bad Request');
        });
    });
});
