import React from 'react';
import { render } from '@testing-library/react';
import { AssetsList } from './ApiAssetsField';
import { ApiHubProvider } from '../ApiHubContext';

describe('ApiAssetsField', () => {
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
});
