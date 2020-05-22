import { fetchUtils } from 'ra-core';

import { apisDataProvider, getFilter } from './apis';

describe('dataProvider - APIs', () => {
    describe('apisDataProvider', () => {
        describe('getPermissions', () => {
            test('should fetch the correct url for getPermissions', async () => {
                fetchUtils.fetchJson = jest.fn().mockResolvedValue({
                    json: [],
                });

                const { getPermissions } = apisDataProvider(
                    'https://apim.marmelab.com/api/apim',
                    'https://apim.marmelab.com/admin'
                );

                await getPermissions({ id: 'covfefe' });

                expect(
                    fetchUtils.fetchJson
                ).toHaveBeenCalledWith(
                    'https://apim.marmelab.com/admin/api-management/internal/permissions/apis/covfefe/permitted',
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
