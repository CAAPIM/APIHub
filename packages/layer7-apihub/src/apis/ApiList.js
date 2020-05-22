import React, { cloneElement } from 'react';
import {
    DateField,
    Filter,
    ReferenceArrayInput,
    sanitizeListRestProps,
    SelectArrayInput,
    SearchInput,
    SelectInput,
    TextField,
    TopToolbar,
} from 'react-admin';
import { useTranslate } from 'ra-core';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import {
    AccessField,
    CardGrid,
    Datagrid,
    List,
    ListDisplayButton,
    ListDisplayProvider,
    LIST_DISPLAY_CARDS,
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

const defaultSort = { field: 'createTs', order: 'DESC' };

const listDisplayPreferenceName = 'listDisplay/apis';

export const ApiList = props => {
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
                actions={<ApiListActions />}
                filters={<ApiFilter />}
                sort={defaultSort}
                bulkActionButtons={false}
                component={ApiListComponent}
                {...props}
            >
                <ApiListDisplay />
            </List>
        </ListDisplayProvider>
    );
};

const ApiListComponent = props => <div {...props} />;

const useApiFilterStyles = makeStyles({
    searchInput: {
        minWidth: '300px',
    },
});

const ApiFilter = props => {
    const translate = useTranslate();
    const classes = useApiFilterStyles();

    return (
        <Filter {...props}>
            <SearchInput
                source="q"
                className={classes.searchInput}
                alwaysOn
                placeholder={translate('resources.apis.list.filters.search')}
            />
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
            />
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
                ]}
            />
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
            />
            <ReferenceArrayInput source="tags" reference="tags">
                <SelectArrayInput optionText="name" />
            </ReferenceArrayInput>
        </Filter>
    );
};

const ApiListDisplay = props => {
    const [display] = useListDisplay();

    if (display === LIST_DISPLAY_CARDS) {
        return (
            <CardGrid {...props}>
                <ApiCard />
            </CardGrid>
        );
    }

    return (
        <Card>
            <Datagrid rowClick="show" {...props}>
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

const useApiListActionsStyles = makeStyles(
    theme => ({
        root: {
            alignItems: 'center',
        },
        button: {
            marginLeft: theme.spacing(),
        },
    }),
    { name: 'Layer7ApiListActions' }
);

const ApiListActions = ({
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
    const classes = useApiListActionsStyles();
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
                <ApiListSortButton
                    resource={resource}
                    currentSort={currentSort}
                />
            ) : null}
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

const SortByNameASC = { field: 'name', order: 'ASC' };
const SortByNameDESC = { field: 'name', order: 'DESC' };
const SortByCreateTsASC = { field: 'createTs', order: 'ASC' };
const SortByCreateTsDESC = { field: 'createTs', order: 'DESC' };
const SortByModifyTsASC = { field: 'modifyTs', order: 'ASC' };
const SortByModifyTsDESC = { field: 'modifyTs', order: 'DESC' };
