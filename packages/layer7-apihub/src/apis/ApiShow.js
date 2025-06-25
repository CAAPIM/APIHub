// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import get from 'lodash/get';
import { makeStyles } from 'tss-react/mui';

import { Show } from '../ui';
import { ENTITY_TYPE_API } from '../dataProvider/documents';
import { CurrentUserId } from '../dataProvider/userContexts';
import { isPublisher } from '../userContexts';
import { ApiOverview } from './ApiOverview';
import { ApiDocumentation } from './ApiDocumentation';
import { ApiSpecs } from './ApiSpecs';
import { useQuery } from '@tanstack/react-query';
import {
    useDataProvider,
    useGetOne,
    TabbedShowLayout,
    useRecordContext,
    useTranslate,
    useGetRecordId,
    useCreatePath,
} from 'react-admin';
import { Link } from 'react-router-dom';

export const ApiShow = props => {
    const { classes } = useStyles(props);
    const { root: rootClassName } = classes;
    const id = useGetRecordId();
    const dataProvider = useDataProvider();
    const { data: userContexts, isSuccess: fetchUserContextIsSuccess } =
        useGetOne('userContexts', {
            id: CurrentUserId,
        });

    const {
        data: apisPermissionsResponse,
        isSuccess: fetchApisPermissionsIsSuccess,
    } = useQuery({
        queryKey: ['apis', 'getPermissions', { id }],
        queryFn: () => dataProvider.getPermissions('apis', { id }),
    });

    return (
        <Show className={rootClassName} classes={classes} title={<ApiTitle />}>
            {fetchApisPermissionsIsSuccess && fetchUserContextIsSuccess && (
                <ApiShowTabs
                    userIsPublisher={isPublisher(userContexts)}
                    userCanEdit={get(
                        apisPermissionsResponse.data,
                        'canEdit',
                        false
                    )}
                    userCanDelete={get(
                        apisPermissionsResponse.data,
                        'canEdit',
                        false
                    )}
                />
            )}
        </Show>
    );
};

export const ApiShowTabs = ({
    userIsPublisher,
    userCanEdit,
    userCanDelete,
}) => {
    const translate = useTranslate();
    const record = useRecordContext();
    const showSpecs = !isSoapApi(record);
    const createPath = useCreatePath();
    const id = useGetRecordId();

    return (
        <TabbedShowLayout
            syncWithLocation={false} // override default onclick tab behaviour to erase query parameters when navigating between tabs
        >
            <TabbedShowLayout.Tab
                label={'resources.apis.overview.title'}
                to={createPath({
                    id,
                    resource: 'apis',
                    type: 'show',
                })}
                component={Link}
            >
                <ApiOverview userIsPublisher={userIsPublisher} />
            </TabbedShowLayout.Tab>
            {showSpecs && (
                <TabbedShowLayout.Tab
                    label={translate('resources.apis.specification.title')}
                    path="spec"
                    to={`${createPath({
                        id,
                        resource: 'apis',
                        type: 'show',
                    })}/spec`}
                    component={Link}
                >
                    <ApiSpecs />
                </TabbedShowLayout.Tab>
            )}
            <TabbedShowLayout.Tab
                label={translate('resources.apis.documentation.title')}
                path="doc"
                to={`${createPath({
                    id,
                    resource: 'apis',
                    type: 'show',
                })}/doc`}
                component={Link}
            >
                <ApiDocumentation
                    userCanEdit={userCanEdit}
                    userCanDelete={userCanDelete}
                    entityType={ENTITY_TYPE_API}
                />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    );
};

const ApiTitle = () => {
    const { classes } = useTitleStyles();
    const record = useRecordContext();

    if (!record) {
        return null;
    }

    return (
        <div className={classes.root}>
            <span className={classes.title}>{record.name}</span>
        </div>
    );
};

export const isSoapApi = record => {
    // The API type is defined as ssgServiceType in the API list page,
    // but as apiServiceType in the API show page.
    // The react-admin engine first renders the API show page with the data of the API list page
    // in order to improve the user experience.
    // So we need to test both names to avoid a visual glitch when rendering the Tabs.
    const type =
        get(record, 'apiServiceType', null) ||
        get(record, 'ssgServiceType', null);
    return type && type.toLowerCase() === 'soap';
};

// We don't need custom styles by default but this allows to
// easily customize styles in the theme file directly
const useStyles = makeStyles({ name: 'Layer7ApiShow' })({
    root: {},
    card: {},
});

const useTitleStyles = makeStyles({ name: 'Layer7ApplicationTitle' })({
    root: {},
    title: {},
});
