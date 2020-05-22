import React, { useState, useEffect } from 'react';
import expect from 'expect';
import { render, wait } from '@testing-library/react';

import { usePasswordEncryption } from './usePasswordEncryption';
import { ApiHubProvider } from '../ApiHubContext';

describe('usePasswordEncryption', () => {
    const encrypt = jest.fn().mockResolvedValue('encrypted');
    const publicKey =
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgVL6G4zaK+ngqrBheIqP1HcqZIdT8cyHJhvZ9rqOSRdemmvMTFsBoJScPAQQl/jlb7VVVvkGdkvSompszpHaIMQxWG6QuBF23v72nu5NmpYDBsyHZHgIROzqdzqycfKhvWrdDFfq17eZmarsNzvc4KVF3CVv+aM4aXmLPXCIMhrq6M+MYcwMYMS5G6JEYXQtvpw5GQHDm6nfTHNds3wBzooakaOMIldae56jRnX+ILeb+yPWmjsPPwbaOjU2cbygNKMHBfnLEFRz05J2XcGh/DGm4x0s12jnPNiH8hkHd8U8bviwvLlreNBM1XCThL0V07HCETzUPQOhpLtplUh7RwIDAQAB';

    const Component = () => {
        const [publicKey, encryptData] = usePasswordEncryption(encrypt);
        const [password, setPassword] = useState();

        useEffect(() => {
            if (publicKey && !password) {
                encryptData('Password@1').then(setPassword);
            }
        }, [encryptData, password, publicKey, setPassword]);

        return <p>{password}</p>;
    };

    test('should encypt the password with the publicKey fetched from the API', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            status: 200,
            json: () =>
                Promise.resolve({
                    respCode: 200,
                    respMsg: 'Successfully fetched public key',
                    publicKey,
                }),
        });

        const { queryByText } = render(
            <ApiHubProvider url="/api" tenantName="api">
                <Component />
            </ApiHubProvider>
        );

        await wait(() => {
            expect(queryByText('encrypted')).not.toBeNull();
            expect(encrypt).toHaveBeenCalledWith(publicKey, 'Password@1');
        });
    });
});
