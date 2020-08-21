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
import { ENTITY_TYPE_API } from '../dataProvider/documents';
import { CurrentUserId } from '../dataProvider/userContexts';
import { isPublisher } from '../userContexts';
import { ApiOverview } from './ApiOverview';
import { ApiDocumentation } from './ApiDocumentation';
import { ApiShowMetrics } from './ApiShowMetrics';
import { ApiSpecs } from './ApiSpecs';

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

export const ApiShowTabs = props => {
    const translate = useTranslate();
    const { userIsPublisher, userCanEdit, userCanDelete, ...rest } = props;

    const showSpecs = !isSoapApi(props.record);

    return (
        <TabbedShowLayout {...rest}>
            <Tab label={translate('resources.apis.overview.title')}>
                <ApiOverview userIsPublisher={userIsPublisher} />
            </Tab>
            {showSpecs && (
                <Tab
                    label={translate('resources.apis.specification.title')}
                    path="spec"
                >
                    <ApiSpecs />
                </Tab>
            )}
            <Tab
                label={translate('resources.apis.documentation.title')}
                path="doc"
            >
                <ApiDocumentation
                    userCanEdit={userCanEdit}
                    userCanDelete={userCanDelete}
                    entityType={ENTITY_TYPE_API}
                />
            </Tab>
            <Tab
                label={translate('resources.apis.monitoring.title')}
            >
                <ApiShowMetrics />
            </Tab>
        </TabbedShowLayout>
    );
};

const ApiTitle = ({ record, ...rest }) => {
    const classes = useTitleStyles(rest);

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
const useStyles = makeStyles(
    {
        root: {},
        card: {},
    },
    {
        name: 'Layer7ApiShow',
    }
);

const useTitleStyles = makeStyles(
    theme => ({
        root: {},
        title: {},
    }),
    {
        name: 'Layer7ApplicationTitle',
    }
);
