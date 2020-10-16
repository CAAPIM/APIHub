import React from 'react';
import { ApiList as DefaultApiList } from 'layer7-apihub';
import { useTranslate } from 'ra-core';
import {
    Filter,
    SearchInput,
    SelectInput,
    SelectArrayInput,
    ReferenceArrayInput,
    ReferenceInput,
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

export const ApiList = props => (
    <DefaultApiList filters={<ApiFilter />} {...props} />
);

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
                        id: 'PUBLIC',
                        name: 'resources.apis.accessStatus.public',
                    },
                    {
                        id: 'PRIVATE',
                        name: 'resources.apis.accessStatus.private',
                    },
                ]}
            />
            <SelectInput
                source="portalStatus"
                choices={[
                    {
                        id: 'ENABLED',
                        name: 'resources.apis.portalStatus.enabled',
                    },
                    {
                        id: 'DISABLED',
                        name: 'resources.apis.portalStatus.disabled',
                    },
                    {
                        id: 'DEPRECATED',
                        name: 'resources.apis.portalStatus.deprecated',
                    },
                    {
                        id: 'NEW',
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
            <ReferenceInput alwaysOn source="apiGroup" reference="apiGroups">
                <SelectInput optionText="name" />
            </ReferenceInput>
        </Filter>
    );
};

const useApiFilterStyles = makeStyles({
    searchInput: {
        minWidth: '300px',
    },
});
