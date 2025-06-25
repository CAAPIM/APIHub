// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useEffect, useState } from 'react';
import {
    SelectInput,
    TopToolbar,
    CreateButton,
    useTranslate,
    FilterButton,
} from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

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
import Inbox from '@mui/icons-material/Inbox';

const defaultSort = { field: 'name', order: 'ASC' };

const listDisplayPreferenceName = 'listDisplay/applications';

const useEmptyStyles = makeStyles({ name: 'Empty' })(theme => ({
    message: {
        textAlign: 'center',
        opacity: theme.palette.mode === 'light' ? 0.5 : 0.8,
        margin: '0 1em',
        color:
            theme.palette.mode === 'light'
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
}));
const Empty = ({ canCRUD }) => {
    const { classes } = useEmptyStyles();
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
    const [canCRUD, setCanCRUD] = useState(false);

    useEffect(() => {
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
                filters={filters}
                sort={defaultSort}
                component={ApplicationListComponent}
                {...props}
            >
                <ApplicationListDisplay />
            </List>
        </ListDisplayProvider>
    );
};

const ApplicationListComponent = props => <div {...props} />;

const filters = [
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
                name: 'resources.applications.status.application_pending_approval',
            },
            {
                id: 'INCOMPLETE',
                name: 'resources.applications.status.incomplete',
            },
            {
                id: 'DELETE_FAILED',
                name: 'resources.applications.status.delete_failed',
            },
        ]}
    />,
];

const ApplicationListDisplay = () => {
    const [display] = useListDisplay();
    const { classes } = useApplicationListStyles();

    if (display === LIST_DISPLAY_CARDS) {
        return (
            <CardGrid>
                <ApplicationCard />
            </CardGrid>
        );
    }

    return (
        <Card className={classes.root}>
            <Datagrid
                className={classes.datagrid}
                rowClick="show"
                bulkActionButtons={false}
            >
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

const useApplicationListStyles = makeStyles({ name: 'Layer7ApplicationList' })(
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
    })
);

const useApplicationListActionsStyles = makeStyles()(theme => ({
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

const ApplicationListActions = ({ className, canCRUD }) => {
    const { classes, cx } = useApplicationListActionsStyles();
    const [display] = useListDisplay();

    return (
        <TopToolbar className={cx(classes.root, className)}>
            {canCRUD && (
                <CreateButton
                    variant="contained"
                    color="primary"
                    className={classes.createButton}
                    label="resources.applications.actions.addApplication"
                />
            )}
            <FilterButton />
            {display === LIST_DISPLAY_CARDS && <ApplicationListSortButton />}
            <ListDisplayButton className={classes.button} />
        </TopToolbar>
    );
};

export const ApplicationListSortButton = () => (
    <SortButton>
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
