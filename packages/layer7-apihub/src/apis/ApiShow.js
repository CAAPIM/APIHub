import React from 'react';
import {
    TabbedShowLayout,
    Tab,
    useGetOne,
    useQuery,
    CRUD_GET_ONE,
} from 'react-admin';
import { useTranslate } from 'ra-core';
import get from 'lodash/get';
import { makeStyles } from '@material-ui/core/styles';

import { Show } from '../ui';
import { CurrentUserId } from '../dataProvider/userContexts';
import { isPublisher } from '../userContexts';
import { Overview } from './Overview';
import { Documentation } from './Documentation';
import { Specs } from './Specs';

const ApiTitle = ({ record }) => (record ? record.name : '');

// We don't need custom styles by default but this allows to
// easily customize styles in the theme file directly
const useStyles = makeStyles(
    {
        root: {},
        card: {},
    },
    { name: 'Layer7ApiShow' }
);

export const ApiShow = props => {
    const { root: rootClassName, ...classes } = useStyles(props);
    const { id, ...rest } = props;
    const { data: userContexts } = useGetOne('userContexts', CurrentUserId, {
        action: CRUD_GET_ONE,
    });

    const { data: apisPermissions } = useQuery({
        type: 'getPermissions',
        resource: 'apis',
        payload: { id },
    });

    return (
        <Show
            className={rootClassName}
            classes={classes}
            title={<ApiTitle />}
            id={id}
            {...rest}
        >
            <ApiShowTabs
                userIsPublisher={isPublisher(userContexts)}
                userCanEdit={get(apisPermissions, 'canEdit', false)}
                userCanDelete={get(apisPermissions, 'canEdit', false)}
            />
        </Show>
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

export const ApiShowTabs = props => {
    const translate = useTranslate();
    const { userIsPublisher, userCanEdit, userCanDelete, ...rest } = props;

    const showSpecs = !isSoapApi(props.record);

    return (
        <TabbedShowLayout {...rest}>
            <Tab label={translate('resources.apis.overview.title')}>
                <Overview userIsPublisher={userIsPublisher} />
            </Tab>
            {showSpecs && (
                <Tab
                    label={translate('resources.apis.specification.title')}
                    path="spec"
                >
                    <Specs />
                </Tab>
            )}
            <Tab
                label={translate('resources.apis.documentation.title')}
                path="doc"
            >
                <Documentation
                    userCanEdit={userCanEdit}
                    userCanDelete={userCanDelete}
                />
            </Tab>
        </TabbedShowLayout>
    );
};
