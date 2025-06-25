// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { apisDataProvider, getFilter } from './apis';

describe('dataProvider - APIs', () => {
    describe('apisDataProvider', () => {
        describe('getPermissions', () => {
            test('should fetch the correct url for getPermissions', async () => {
                const fetchJson = jest.fn().mockResolvedValue({
                    json: [],
                });

                const { getPermissions } = apisDataProvider({
                    apiUrl: 'https://apim.marmelab.com/api/apim',
                    adminUrl: 'https://apim.marmelab.com/admin',
                    fetchJson,
                });

                await getPermissions({ id: 'covfefe' });

                expect(
                    fetchJson
                ).toHaveBeenCalledWith(
                    'https://apim.marmelab.com/api/apim/api-management/internal/permissions/apis/covfefe/permitted',
                    { credentials: 'include' }
                );
            });
        });
    });

    describe('getFilter', () => {
        test('should apply fulltext search according to the resource search map', () => {
            expect(
                getFilter({ q: 'petstore', accessStatus: 'public' }, [
                    'name',
                    'description',
                ])
            ).toEqual({
                name: 'petstore',
                description: 'petstore',
                accessStatus: 'public',
            });
        });

        test('should return filters unmodified if no fulltext search is provided', () => {
            expect(
                getFilter({ accessStatus: 'public' }, ['name', 'description'])
            ).toEqual({
                accessStatus: 'public',
            });
        });

        test('should return filters unmodified if fulltext search is provided but there are no searchable fields for this resource', () => {
            expect(getFilter({ accessStatus: 'public' }, {})).toEqual({
                accessStatus: 'public',
            });
        });
    });
});
