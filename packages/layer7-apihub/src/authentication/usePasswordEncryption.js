// Copyright © 2026 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { useEffect, useState } from 'react';
import forge from 'node-forge';
import { useApiHub } from '../ApiHubContext';
import { getFetchJson } from '../fetchUtils';

/**
 * Encrypts plaintext using RSA-OAEP.
 *
 * Parameters match Java's Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding")
 * with an explicit OAEPParameterSpec("SHA-256", "MGF1", MGF1ParameterSpec.SHA1, DEFAULT):
 *   - OAEP hash: SHA-256
 *   - MGF1 internal hash: SHA-1 (Java default for OAEPWithSHA-256AndMGF1Padding)
 *
 * The public key may arrive as a raw flat Base64 DER string (no PEM headers) from
 * EteKeyController. PEM headers are added automatically when absent so that
 * node-forge can parse it.
 *
 * @param {string} publicKey - RSA public key: PEM or raw Base64 DER.
 * @param {string} data - Plaintext to encrypt.
 * @returns {Promise<string|false>} Base64-encoded ciphertext, or false on failure.
 */
export const defaultEncrypt = (publicKey, data) => {
    if (!publicKey || !data) return Promise.resolve(false);
    try {
        const pemKey = publicKey.includes('-----BEGIN')
            ? publicKey
            : `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
        const rsaKey = forge.pki.publicKeyFromPem(pemKey);
        const encrypted = rsaKey.encrypt(data, 'RSA-OAEP', {
            md: forge.md.sha256.create(),
            mgf1: {
                md: forge.md.sha1.create(),
            },
        });
        return Promise.resolve(forge.util.encode64(encrypted));
    } catch (error) {
        console.error('Password encryption failed', error);
        return Promise.resolve(false);
    }
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
