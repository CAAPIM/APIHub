import { useEffect, useState } from 'react';
import JSEncrypt from 'jsencrypt';
import { useApiHub } from '../ApiHubContext';

export const defaultEncrypt = (publicKey, data) => {
    const encrypter = new JSEncrypt();
    encrypter.setPublicKey(publicKey);
    return Promise.resolve(encrypter.encrypt(data));
};

/**
 * A hook which will fetch the API public key and provide a function to encrypt data.
 * @param {*} encrypt The function to encrypt data.
 * It receives the public key as its first parameter and the dat to encrypt next.
 * It returns a promise resolving to the encrypted data.
 * @returns A tupple with the public key first and the encrypt function next.
 * @example
 *
 * const [publicKey, encrypt] = usePasswordEncryption();
 */
export const usePasswordEncryption = (encrypt = defaultEncrypt) => {
    const { urlWithTenant } = useApiHub();
    const [publicKey, setPublicKey] = useState();

    useEffect(() => {
        fetchPublicKey(urlWithTenant)
            .then(setPublicKey)
            .catch(console.error);
    }, [urlWithTenant]);

    const encryptData = async data => {
        if (!publicKey) {
            return data;
        }

        const encryptedData = await encrypt(publicKey, data);
        return encryptedData;
    };

    return [publicKey, encryptData];
};

const fetchPublicKey = async apiBaseUrl => {
    const response = await fetch(`${apiBaseUrl}/authenticate/getPublicKey`);

    if (response.status < 200 || response.status >= 300) {
        return undefined;
    }

    const data = await response.json();

    return data.publicKey;
};
