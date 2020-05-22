import React from 'react';
import {
    DataProviderContext,
    TestContext,
    TranslationProvider,
} from 'react-admin';

import { i18nProvider } from '../i18n';
import { ApiList } from './ApiList';

export default {
    title: 'Apis/ApiList',
    component: ApiList,
};

export const Default = () => (
    <TestContext initialState={initialState}>
        <DataProviderContext.Provider value={dataProvider}>
            <TranslationProvider i18nProvider={i18nProvider('en')}>
                <ApiList
                    basePath="/apis"
                    resource="apis"
                    hasCreate={false}
                    hasShow={false}
                    hasEdit={false}
                    hasList
                />
            </TranslationProvider>
        </DataProviderContext.Provider>
    </TestContext>
);

const ids = [
    '1e2bbc39-d1e3-4323-a252-8d5345cbdfbf',
    'f6195b21-f52a-4e33-a458-aa4f63871122',
    'fa2678a8-896d-4b47-ae91-991157ec49b8',
    'b9fadbff-1a7e-4fac-95f6-b35f9aaf81fb',
    'c2f1c8f2-0d0e-48d8-8b45-9caed203a2db',
    'f28fc9b8-69cb-4c22-855e-6ffe7198cd63',
];
const data = {
    '1e2bbc39-d1e3-4323-a252-8d5345cbdfbf': {
        id: '1e2bbc39-d1e3-4323-a252-8d5345cbdfbf',
        name: 'Demo SOAP Service 1',
        description: 'WY-Here is the desc for Demo SOAP Service 1',
        type: 'BASIC',
        portalStatus: 'ENABLED',
        accessStatus: 'PUBLIC',
        specFilename: null,
        version: '1',
        apiEulaUuid: '8cf670c0-7bc4-4780-b65c-c1e352d4c6f2',
        createTs: 1580322057743,
        modifyTs: 1580322109785,
        ssgServiceType: 'SOAP',
        applicationUsage: 0,
        managingOrgUuid: null,
        tags: ['test', 'demo'],
    },
    'f6195b21-f52a-4e33-a458-aa4f63871122': {
        id: 'f6195b21-f52a-4e33-a458-aa4f63871122',
        name: 'Demo',
        description:
            'Illustrates basics: multi-database APIs, logic, Data Explorer',
        type: 'BASIC',
        portalStatus: 'ENABLED',
        accessStatus: 'PRIVATE',
        specFilename: null,
        version: '1',
        apiEulaUuid: '12f5755f-ffa5-490e-b760-43356d85a3d3',
        createTs: 1579751267373,
        modifyTs: 1579751278347,
        ssgServiceType: 'REST',
        applicationUsage: 1,
        managingOrgUuid: null,
        tags: [],
    },
    'fa2678a8-896d-4b47-ae91-991157ec49b8': {
        id: 'fa2678a8-896d-4b47-ae91-991157ec49b8',
        name: 'Swagger Petstore',
        description: 'Pet Store',
        type: 'BASIC',
        portalStatus: 'ENABLED',
        accessStatus: 'PRIVATE',
        specFilename: null,
        version: '1.0.0',
        apiEulaUuid: '12f5755f-ffa5-490e-b760-43356d85a3d3',
        createTs: 1579751108574,
        modifyTs: 1579751128590,
        ssgServiceType: 'REST',
        applicationUsage: 1,
        managingOrgUuid: null,
        tags: [],
    },
    'b9fadbff-1a7e-4fac-95f6-b35f9aaf81fb': {
        id: 'b9fadbff-1a7e-4fac-95f6-b35f9aaf81fb',
        name: 'Reference Portal Custom API (read only)',
        description:
            'Allow one to assign custom pages.  For example, one can assign a new home page, login page , registration page, etc',
        type: 'BASIC',
        portalStatus: 'ENABLED',
        accessStatus: 'PRIVATE',
        specFilename: null,
        version: '1',
        apiEulaUuid: '8cf670c0-7bc4-4780-b65c-c1e352d4c6f2',
        createTs: 1579716285678,
        modifyTs: 1579716285678,
        ssgServiceType: 'REST',
        applicationUsage: 1,
        managingOrgUuid: null,
        tags: [],
    },
    'c2f1c8f2-0d0e-48d8-8b45-9caed203a2db': {
        id: 'c2f1c8f2-0d0e-48d8-8b45-9caed203a2db',
        name: 'Reference Portal API (read only)',
        description:
            'Provides access to Portal APIs for programmatically interacting with your Portal',
        type: 'BASIC',
        portalStatus: 'ENABLED',
        accessStatus: 'PRIVATE',
        specFilename: null,
        version: '1',
        apiEulaUuid: '8cf670c0-7bc4-4780-b65c-c1e352d4c6f2',
        createTs: 1579716284626,
        modifyTs: 1579716284626,
        ssgServiceType: 'REST',
        applicationUsage: 1,
        managingOrgUuid: null,
        tags: [],
    },
    'f28fc9b8-69cb-4c22-855e-6ffe7198cd63': {
        id: 'f28fc9b8-69cb-4c22-855e-6ffe7198cd63',
        name: 'Login API',
        description: null,
        type: 'BASIC',
        portalStatus: 'ENABLED',
        accessStatus: 'PUBLIC',
        specFilename: 'url',
        version: '2',
        apiEulaUuid: '8cf670c0-7bc4-4780-b65c-c1e352d4c6f2',
        createTs: 1579716283481,
        modifyTs: 0,
        ssgServiceType: 'REST',
        applicationUsage: 0,
        managingOrgUuid: null,
        tags: [],
    },
};

const dataProvider = {
    getList: () =>
        Promise.resolve({
            data: Object.values(data),
            total: 6,
        }),
};

const initialState = {
    admin: {
        resources: {
            apis: {
                data,
                list: {
                    ids,
                    loadedOnce: true,
                    selectedIds: [],
                    total: 6,
                },
            },
        },
    },
};
