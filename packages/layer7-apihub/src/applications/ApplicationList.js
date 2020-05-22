import React, { cloneElement } from 'react';
import {
    Filter,
    sanitizeListRestProps,
    SelectInput,
    TopToolbar,
} from 'react-admin';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import { readApiHubPreference } from '../preferences';
import {
    AccessField,
    CardGrid,
    Datagrid,
    List,
    ListDisplayButton,
    ListDisplayProvider,
    LIST_DISPLAY_CARDS,
    SortButton,
    SortMenuItem,
    TruncatedTextField,
    useListDisplay,
} from '../ui';
import { ApplicationCard } from './ApplicationCard';

const defaultSort = { field: 'uuid', order: 'ASC' };

const listDisplayPreferenceName = 'listDisplay/applications';

export const ApplicationList = props => {
    const initialListDisplay = readApiHubPreference(
        listDisplayPreferenceName,
        LIST_DISPLAY_CARDS
    );

    return (
        <ListDisplayProvider
            initialListDisplay={initialListDisplay}
            preferenceName={listDisplayPreferenceName}
        >
            <List
                actions={<ApplicationListActions />}
                filter={{ $select: 'Name,Uuid,ApiKey,Status,Description' }}
                filters={<ApplicationFilter />}
                sort={defaultSort}
                bulkActionButtons={false}
                component={ApplicationListComponent}
                {...props}
            >
                <ApplicationListDisplay />
            </List>
        </ListDisplayProvider>
    );
};

const ApplicationListComponent = props => <div {...props} />;

const ApplicationFilter = props => {
    return (
        <Filter {...props}>
            <SelectInput
                source="status"
                choices={[
                    {
                        id: 'Enabled',
                        name: 'resources.applications.status.enabled',
                    },
                    {
                        id: 'Disabled',
                        name: 'resources.applications.status.disabled',
                    },
                ]}
            />
        </Filter>
    );
};

const ApplicationListDisplay = props => {
    const [display] = useListDisplay();

    if (display === LIST_DISPLAY_CARDS) {
        return (
            <CardGrid {...props}>
                <ApplicationCard />
            </CardGrid>
        );
    }

    return (
        <Card>
            <Datagrid rowClick="show" {...props}>
                <TruncatedTextField source="name" />
                <AccessField
                    source="status"
                    translationKey="resources.applications.status"
                />
            </Datagrid>
        </Card>
    );
};

const useApplicationListActionsStyles = makeStyles(theme => ({
    root: {
        alignItems: 'center',
    },
    button: {
        marginLeft: theme.spacing(),
    },
}));

const ApplicationListActions = ({
    className,
    currentSort,
    displayedFilters,
    exporter,
    filters,
    filterValues,
    permanentFilter,
    resource,
    showFilter,
    ...props
}) => {
    const classes = useApplicationListActionsStyles();
    const [display] = useListDisplay();

    return (
        <TopToolbar
            className={classnames(classes.root, className)}
            {...sanitizeListRestProps(props)}
        >
            {filters &&
                cloneElement(filters, {
                    resource,
                    showFilter,
                    displayedFilters,
                    filterValues,
                    context: 'button',
                })}
            {display === LIST_DISPLAY_CARDS ? (
                <ApplicationListSortButton
                    resource={resource}
                    currentSort={currentSort}
                />
            ) : null}
            <ListDisplayButton className={classes.button} />
        </TopToolbar>
    );
};

export const ApplicationListSortButton = props => (
    <SortButton {...props}>
        <SortMenuItem
            label="resources.applications.list.sort.name.asc"
            sort={SortByNameASC}
        />
        <SortMenuItem
            label="resources.applications.list.sort.name.desc"
            sort={SortByNameDESC}
        />
    </SortButton>
);

const SortByNameASC = { field: 'name', order: 'ASC' };
const SortByNameDESC = { field: 'name', order: 'DESC' };
