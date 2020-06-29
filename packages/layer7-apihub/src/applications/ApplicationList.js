import React, { cloneElement } from 'react';
import {
    Filter,
    sanitizeListRestProps,
    SelectInput,
    TextField,
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

const defaultSort = { field: 'name', order: 'ASC' };

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
                        id: 'ENABLED',
                        name: 'resources.applications.status.enabled',
                    },
                    {
                        id: 'DISABLED',
                        name: 'resources.applications.status.disabled',
                    },
                    {
                        id: 'APPLICATION_PENDING_APPROVAL',
                        name:
                            'resources.applications.status.application_pending_approval',
                    },
                ]}
            />
        </Filter>
    );
};

const ApplicationListDisplay = props => {
    const [display] = useListDisplay();
    const classes = useApplicationListStyles();

    if (display === LIST_DISPLAY_CARDS) {
        return (
            <CardGrid {...props}>
                <ApplicationCard />
            </CardGrid>
        );
    }

    return (
        <Card className={classes.root}>
            <Datagrid className={classes.datagrid} rowClick="show" {...props}>
                <TruncatedTextField
                    source="name"
                    cellClassName={classes.name}
                />
                <TruncatedTextField
                    source="description"
                    cellClassName={classes.description}
                />
                <AccessField
                    source="status"
                    translationKey="resources.applications.status"
                    cellClassName={classes.status}
                />
            </Datagrid>
        </Card>
    );
};
const useApplicationListStyles = makeStyles(
    theme => ({
        root: {},
        datagrid: {},
        name: {},
        status: {},
        description: {
            '& span': {
                maxWidth: '30vw',
                [theme.breakpoints.up('lg')]: {
                    maxWidth: '25vw',
                },
            },
        },
    }),
    {
        name: 'Layer7ApplicationList',
    }
);

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
