import React from 'react';
import { waitFor } from '@testing-library/react';
import { getFetchJson } from '../fetchUtils';

import { credentialsAuthProvider } from './credentialsAuthProvider';

const fetchJson = getFetchJson('apim');

describe('credentialsAuthProvider', () => {
    describe('login', () => {
        it('sends a login request', () => {
            global.fetch = jest.fn().mockResolvedValue({
                text: () =>
                    Promise.resolve(
                        JSON.stringify({
                            respCode: '200',
                        })
                    ),
            });

            expect(credentialsAuthProvider('/api', fetchJson).login()).resolves
        });
    });

    describe('logout', () => {
        it('sends a logout request', () => {
            global.fetch = jest.fn().mockResolvedValue({
                text: () =>
                    Promise.resolve()
            });
            expect(credentialsAuthProvider('/api', fetchJson).logout()).resolves
        });
    });

    describe('checkAuth', () => {
        it('returns a promise', () => {
            expect(credentialsAuthProvider('/api', fetchJson).checkAuth()).resolves
        });
    });

    describe('checkError', () => {
        it('returns a promise', () => {
            expect(credentialsAuthProvider('/api', fetchJson).checkError()).resolves
        });
    });

    describe('getPermissions', () => {
        it('returns a promise', () => {
            expect(credentialsAuthProvider('/api', fetchJson).getPermissions()).resolves
        });
    });
});
