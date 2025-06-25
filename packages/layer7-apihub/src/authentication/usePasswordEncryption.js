// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { useEffect, useState } from 'react';
import JSEncrypt from 'jsencrypt';
import { useApiHub } from '../ApiHubContext';
import { getFetchJson } from '../fetchUtils';

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
    const { urlWithTenant, originHubName } = useApiHub();
    const [publicKey, setPublicKey] = useState();

    useEffect(() => {
        fetchPublicKey(urlWithTenant, originHubName)
            .then(setPublicKey)
            .catch(console.error);
    }, [originHubName, urlWithTenant]);

    const encryptData = async data => {
        if (!publicKey) {
            return data;
        }

        const encryptedData = await encrypt(publicKey, data);
        return encryptedData;
    };

    return [publicKey, encryptData];
};

const fetchPublicKey = async (apiBaseUrl, originHubName) => {
    const fetchJson = getFetchJson(originHubName);
    const { json: data } = await fetchJson(
        `${apiBaseUrl}/authenticate/getPublicKey`
    );
    return data.publicKey;
};
