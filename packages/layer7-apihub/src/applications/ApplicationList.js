import React, { cloneElement } from 'react';
import {
    Filter,
    sanitizeListRestProps,
    SelectInput,
    TopToolbar,
    CreateButton,
} from 'react-admin';
import { useTranslate } from 'ra-core';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
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
import { useUserContext } from '../userContexts';
import { isAdminUser } from '../userContexts';
import { ApplicationCard } from './ApplicationCard';
import Inbox from '@material-ui/icons/Inbox';

const defaultSort = { field: 'name', order: 'ASC' };

const listDisplayPreferenceName = 'listDisplay/applications';

const useEmptyStyles = makeStyles(
    theme => ({
        message: {
            textAlign: 'center',
            opacity: theme.palette.type === 'light' ? 0.5 : 0.8,
            margin: '0 1em',
            color:
                theme.palette.type === 'light'
                    ? 'inherit'
                    : theme.palette.text.primary,
        },
        icon: {
            width: '9em',
            height: '9em',
        },
        toolbar: {
            textAlign: 'center',
            marginTop: '2em',
        },
    }),
    { name: 'Empty' }
);
const Empty = ({ canCRUD, basePath, ...props }) => {
    const classes = useEmptyStyles(props);
    const translate = useTranslate();
    return (
        <>
            <div className={classes.message}>
                <Inbox className={classes.icon} />
                <Typography variant="h6" paragraph>
                    {translate('resources.applications.fields.noApplications')}
                </Typography>
            </div>
            {canCRUD && (
                <div className={classes.toolbar}>
                    <CreateButton
                        basePath={basePath}
                        variant="contained"
                        color="primary"
                        label="resources.applications.actions.addApplication"
                    />
                </div>
            )}
        </>
    );
};

export const ApplicationList = props => {
    const initialListDisplay = readApiHubPreference(
        listDisplayPreferenceName,
        LIST_DISPLAY_CARDS
    );
    const [userContext] = useUserContext();
    const [canCRUD, setCanCRUD] = React.useState(false);

    React.useEffect(() => {
        if (userContext && isAdminUser(userContext)) {
            setCanCRUD(true);
        }
    }, [userContext]);

    return (
        <ListDisplayProvider
            initialListDisplay={initialListDisplay}
            preferenceName={listDisplayPreferenceName}
        >
            <List
                empty={<Empty canCRUD={canCRUD} />}
                actions={<ApplicationListActions canCRUD={canCRUD} />}
                filter={{ $select: 'Name,Uuid,ApiKey,Status,Description' }}
                filters={<ApplicationFilter />}
                sort={defaultSort}
                bulkActionButtons={false}
                component={ApplicationListComponent}
                {...props}
            >
                <ApplicationListDisplay canCRUD={canCRUD} />
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
                        id: 'APPLICATION_PENDING_APPROVAL,EDIT_APPLICATION_PENDING_APPROVAL,DELETE_APPLICATION_PENDING_APPROVAL',
                        name:
                            'resources.applications.status.application_pending_approval',
                    },
                ]}
            />
        </Filter>
    );
};

const ApplicationListDisplay = props => {
    const { canCRUD } = props;
    const [display] = useListDisplay();
    const classes = useApplicationListStyles();

    if (display === LIST_DISPLAY_CARDS) {
        return (
            <CardGrid {...props}>
                <ApplicationCard canCRUD={canCRUD} />
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
    createButton: {
        paddingRight: theme.spacing(2),
        marginRight: theme.spacing(2),
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
    hasCreate,
    basePath,
    canCRUD,
    ...props
}) => {
    const classes = useApplicationListActionsStyles();
    const [display] = useListDisplay();

    return (
        <TopToolbar
            className={classnames(classes.root, className)}
            {...sanitizeListRestProps(props)}
        >
            {canCRUD && (
                <CreateButton
                    basePath={basePath}
                    variant="contained"
                    color="primary"
                    className={classes.createButton}
                    label="resources.applications.actions.addApplication"
                />
            )}
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
