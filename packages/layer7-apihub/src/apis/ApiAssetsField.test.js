import React from 'react';
import { render } from '@testing-library/react';
import { ApiAssetsField, AssetsList } from './ApiAssetsField';
import { ApiHubProvider } from '../ApiHubContext';
import { DataProviderContext, renderWithRedux } from 'ra-core';
import { wait } from '@testing-library/react';

const defaultData = [
    {
      uuid: "76f42917-5833-4938-a115-46534e186077",
      id: "76f42917-5833-4938-a115-46534e186077",
      type: "JSON",
      name: "interactive_rich.json",
      _apiUuid: "4f1e2149-c7d8-4bbb-9a8d-9eccce46531f",
      links: [
        {
          rel: "file",
          href: "/api-management/1.0/apis/4f1e2149-c7d8-4bbb-9a8d-9eccce46531f/assets/76f42917-5833-4938-a115-46534e186077/file"
        }
      ]
    },
    {
      uuid: "618e331d-5dab-404c-9c51-fad45962a780",
      id: "618e331d-5dab-404c-9c51-fad45962a780",
      type: "JSON",
      name: "hard_drive_auto_loan_account_fish.json",
      _apiUuid: "6ec5a938-ab7d-4338-b5e5-e62107b737af",
      links: [
        {
          rel: "file",
          href: "/api-management/1.0/apis/6ec5a938-ab7d-4338-b5e5-e62107b737af/assets/618e331d-5dab-404c-9c51-fad45962a780/file"
        }
      ]
    },
];

describe('ApiAssetsField', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('AssetsList', () => {
        test('should show a link for each asset', () => {
            const links = [
                {
                    id: 1,
                    name: 'test 1',
                    type: 'a_type',
                    href: '/test_1',
                },
                {
                    id: 2,
                    name: 'test 2',
                    type: 'another_type',
                    href: '/test_2',
                },
            ];
            const { queryByText } = render(
                <ApiHubProvider url="http://apihub" tenantName="apim">
                    <AssetsList record={{ id: 1 }} links={links} />
                </ApiHubProvider>
            );

            const link1 = queryByText('test 1');
            expect(link1).not.toBeNull();
            expect(link1.getAttribute('href')).toEqual(
                'http://apihub/api/apim/test_1'
            );
            expect(link1.getAttribute('type')).toEqual('a_type');

            const link2 = queryByText('test 2');
            expect(link2).not.toBeNull();
            expect(link2.getAttribute('href')).toEqual(
                'http://apihub/api/apim/test_2'
            );
            expect(link2.getAttribute('type')).toEqual('another_type');
        });

        test('should show a button to download all assets if there are more than 1', () => {
            const links = [
                {
                    id: 1,
                    name: 'test 1',
                    type: 'a_type',
                    href: '/test_1',
                },
                {
                    id: 2,
                    name: 'test 2',
                    type: 'another_type',
                    href: '/test_2',
                },
            ];
            const { queryByLabelText } = render(
                <ApiHubProvider url="http://apihub" tenantName="apim">
                    <AssetsList record={{ id: 1 }} links={links} />
                </ApiHubProvider>
            );

            const downloadAllLink = queryByLabelText(
                'resources.apis.overview.actions.download_assets'
            );

            expect(downloadAllLink).not.toBeNull();
            expect(downloadAllLink.getAttribute('href')).toEqual(
                `http://apihub/api/apim/api-management/1.0/apis/1/assets/archive`
            );
            expect(downloadAllLink.getAttribute('download')).toEqual(
                'assets.zip'
            );
        });

        test('should not show a button to download all assets if there is only 1', () => {
            const links = [
                {
                    id: 1,
                    name: 'test 1',
                    type: 'a_type',
                    href: '/test_1',
                },
            ];
            const { queryByLabelText } = render(
                <ApiHubProvider url="http://apihub" tenantName="apim">
                    <AssetsList record={{ id: 1 }} links={links} />
                </ApiHubProvider>
            );

            const downloadAllLink = queryByLabelText(
                'resources.apis.overview.actions.download_assets'
            );

            expect(downloadAllLink).toBeNull();
        });
    });

    describe('ApiAssetsField', () => {
        const dataProvider = {
            getManyReference: jest.fn().mockResolvedValue({
                data: defaultData,
                total: defaultData.length,
            }),
        };

        const initialState = {
          admin: {
            resources: {
              assets: {},
            },
          },
        };

        test('should list the assets for an API ', async () => {
            const { queryByText } = renderWithRedux(
              <ApiHubProvider url="http://apihub" tenantName="apim">
                  <DataProviderContext.Provider value={dataProvider}>
                      <ApiAssetsField record={{}} />
                  </DataProviderContext.Provider>
              </ApiHubProvider>,
              initialState
            );

            await wait(() => {
              expect(
                queryByText(`interactive_rich.json`)
              ).not.toBeNull();
            });
        });
    });
});
