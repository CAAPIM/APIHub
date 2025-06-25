// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import {
    DateField,
    ReferenceArrayInput,
    SelectArrayInput,
    SearchInput,
    SelectInput,
    TextField,
    TopToolbar,
    useTranslate,
    FilterButton,
} from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import Card from '@mui/material/Card';

import {
    AccessField,
    CardGrid,
    Datagrid,
    List,
    ListDisplayButton,
    ListDisplayProvider,
    LIST_DISPLAY_CARDS,
    LIST_DISPLAY_DATAGRID,
    MarkdownField,
    SortButton,
    SortMenuItem,
    TruncatedTextField,
    useListDisplay,
} from '../ui';
import { ApiCard } from './ApiCard';
import { VisibilityField } from './VisibilityField';
import { TagsField } from './TagsField';
import { LastUpdateField } from './LastUpdateField';
import { readApiHubPreference } from '../preferences';

export const ApiList = props => {
    const translate = useTranslate();
    const { classes } = useApiFilterStyles();
    const initialListDisplay = readApiHubPreference(
        listDisplayPreferenceName,
        LIST_DISPLAY_DATAGRID
    );

    const filters = [
        <SearchInput
            source="q"
            className={classes.searchInput}
            placeholder={translate('resources.apis.list.filters.search')}
            alwaysOn={true}
        />,
        <SelectInput
            source="accessStatus"
            choices={[
                {
                    id: 'public',
                    name: 'resources.apis.accessStatus.public',
                },
                {
                    id: 'private',
                    name: 'resources.apis.accessStatus.private',
                },
            ]}
        />,
        <SelectInput
            source="portalStatus"
            choices={[
                {
                    id: 'Enabled',
                    name: 'resources.apis.portalStatus.enabled',
                },
                {
                    id: 'Disabled',
                    name: 'resources.apis.portalStatus.disabled',
                },
                {
                    id: 'Deprecated',
                    name: 'resources.apis.portalStatus.deprecated',
                },
                {
                    id: 'New',
                    name: 'resources.apis.portalStatus.unpublished',
                },
                {
                    id: 'Incomplete',
                    name: 'resources.apis.portalStatus.incomplete',
                },
            ]}
        />,
        <SelectInput
            // The field is ssgServiceType in the response payload but apiServiceType in filters
            source="apiServiceType"
            choices={[
                {
                    id: 'SOAP',
                    name: 'SOAP',
                },
                {
                    id: 'REST',
                    name: 'REST',
                },
            ]}
        />,
        <ReferenceArrayInput source="tags" reference="tags">
            <SelectArrayInput optionText="name" className={classes.inputRoot} />
        </ReferenceArrayInput>,
    ];

    return (
        <ListDisplayProvider
            initialListDisplay={initialListDisplay}
            preferenceName={listDisplayPreferenceName}
        >
            <List
                actions={<ApiListActions />}
                filters={filters}
                sort={defaultSort}
                component="div"
                {...props}
            >
                <ApiListDisplay />
            </List>
        </ListDisplayProvider>
    );
};

const ApiListDisplay = () => {
    const [display] = useListDisplay();

    if (display === LIST_DISPLAY_CARDS) {
        return (
            <CardGrid>
                <ApiCard />
            </CardGrid>
        );
    }

    return (
        <Card>
            <Datagrid rowClick="show" bulkActionButtons={false}>
                <TruncatedTextField source="name" />
                <MarkdownField source="description" stripTags truncate />
                <TagsField source="tags" sortable={false} />
                <DateField source="createTs" />
                <TruncatedTextField
                    source="version"
                    label="resources.apis.fields.versionShort"
                />
                <TextField source="ssgServiceType" />
                <VisibilityField source="accessStatus" />
                <LastUpdateField source="modifyTs" />
                <AccessField
                    source="portalStatus"
                    translationKey="resources.apis.portalStatus"
                />
            </Datagrid>
        </Card>
    );
};

const ApiListActions = ({ className }) => {
    const { classes, cx } = useApiListActionsStyles();
    const [display] = useListDisplay();

    return (
        <TopToolbar className={cx(classes.root, className)}>
            <FilterButton />
            {display === LIST_DISPLAY_CARDS && <ApiListSortButton />}
            <ListDisplayButton className={classes.button} />
        </TopToolbar>
    );
};

export const ApiListSortButton = props => (
    <SortButton {...props}>
        <SortMenuItem
            label="resources.apis.list.sort.name.asc"
            sort={SortByNameASC}
        />
        <SortMenuItem
            label="resources.apis.list.sort.name.desc"
            sort={SortByNameDESC}
        />
        <SortMenuItem
            label="resources.apis.list.sort.createTs.desc"
            sort={SortByCreateTsDESC}
        />
        <SortMenuItem
            label="resources.apis.list.sort.createTs.asc"
            sort={SortByCreateTsASC}
        />
        <SortMenuItem
            label="resources.apis.list.sort.modifyTs.desc"
            sort={SortByModifyTsDESC}
        />
        <SortMenuItem
            label="resources.apis.list.sort.modifyTs.asc"
            sort={SortByModifyTsASC}
        />
    </SortButton>
);

const defaultSort = { field: 'createTs', order: 'DESC' };

const listDisplayPreferenceName = 'listDisplay/apis';

const SortByNameASC = { field: 'name', order: 'ASC' };
const SortByNameDESC = { field: 'name', order: 'DESC' };
const SortByCreateTsASC = { field: 'createTs', order: 'ASC' };
const SortByCreateTsDESC = { field: 'createTs', order: 'DESC' };
const SortByModifyTsASC = { field: 'modifyTs', order: 'ASC' };
const SortByModifyTsDESC = { field: 'modifyTs', order: 'DESC' };

const useApiFilterStyles = makeStyles()({
    searchInput: {
        minWidth: '300px',
        marginTop: '0px !important',
        marginBottom: '3px !important',
    },
    inputRoot: {
        marginBottom: '5px !important',
        '& .MuiFormLabel-root': {
            top: '-6px',
        },
    },
});

const useApiListActionsStyles = makeStyles({ name: 'Layer7ApiListActions' })(
    theme => ({
        root: {
            alignItems: 'center',
        },
        button: {
            marginLeft: theme.spacing(),
        },
    })
);
