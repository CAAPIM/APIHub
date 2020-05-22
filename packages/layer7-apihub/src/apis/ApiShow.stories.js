import React from 'react';
import {
    DataProviderContext,
    TestContext,
    TranslationProvider,
} from 'react-admin';
import { createMemoryHistory } from 'history';
import { Route } from 'react-router';

import { i18nProvider } from '../i18n';
import { ApiShow } from './ApiShow';
import { ApiHubProvider } from '../ApiHubContext';
import specs from './specs.json';

export default {
    title: 'Apis/ApiShow',
    component: ApiShow,
};

const history = createMemoryHistory({
    initialEntries: ['/apis/1e2bbc39-d1e3-4323-a252-8d5345cbdfbf/show'],
});

export const Default = () => (
    <TestContext initialState={initialState} history={history}>
        <DataProviderContext.Provider value={dataProvider}>
            <TranslationProvider i18nProvider={i18nProvider('en')}>
                <ApiHubProvider url="/apim" tenantName="apim">
                    <Route
                        path="/apis/:id/show"
                        render={routeProps => (
                            <ApiShow
                                id="1e2bbc39-d1e3-4323-a252-8d5345cbdfbf"
                                basePath="/apis"
                                resource="apis"
                                hasCreate={false}
                                hasEdit={false}
                                hasList={false}
                                hasShow
                                {...routeProps}
                            />
                        )}
                    />
                </ApiHubProvider>
            </TranslationProvider>
        </DataProviderContext.Provider>
    </TestContext>
);

const apisData = {
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
    },
};

const tagsData = {
    1: { id: 1, name: 'test' },
    2: { id: 2, name: 'another test' },
};

const assetsData = {
    1: { id: 1, name: 'test' },
    2: { id: 2, name: 'another test' },
};

const specsData = {
    '1e2bbc39-d1e3-4323-a252-8d5345cbdfbf': specs,
};

const dataProvider = {
    getOne: resource =>
        resource === 'apis'
            ? Promise.resolve({
                  data: apisData['1e2bbc39-d1e3-4323-a252-8d5345cbdfbf'],
              })
            : Promise.resolve({
                  data: specs,
              }),
    getList: () =>
        Promise.resolve({
            data: [],
            total: 0,
        }),
    getManyReference: resource =>
        resource === 'tags'
            ? Promise.resolve({
                  data: [
                      { id: 1, name: 'test' },
                      { id: 2, name: 'another test' },
                  ],
                  total: 2,
              })
            : Promise.resolve({
                  data: [
                      { id: 1, name: 'test' },
                      { id: 2, name: 'another test' },
                  ],
                  total: 2,
              }),
    getPermissions: () => Promise.resolve(),
};

const initialState = {
    admin: {
        customQueries: {},
        resources: {
            apis: {
                data: apisData,
            },
            specs: {
                data: specsData,
            },
            tags: {
                data: tagsData,
            },
            assets: {
                data: assetsData,
            },
        },
        references: {
            oneToMany: {
                'apis_tags@id_1e2bbc39-d1e3-4323-a252-8d5345cbdfbf': {
                    ids: [1, 2],
                    total: 2,
                },
                'apis_assets@id_1e2bbc39-d1e3-4323-a252-8d5345cbdfbf': {
                    ids: [1, 2],
                    total: 2,
                },
            },
        },
    },
};
