// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { required, SelectInput, useGetList } from 'react-admin';
import { makeStyles } from 'tss-react/mui';

const useSelectInputStyles = makeStyles()({
    SelectInput: {
        width: '100%',
    },
});

export const OrganizationSelectInput = props => {
    const { data = {}, isLoading } = useGetList('organizations', {
        pagination: {
            page: 1,
            perPage: 200,
        },
        sort: {
            field: 'name',
            order: 'DESC',
        },
    });
    const { classes: selectInputClasses } = useSelectInputStyles();
    const orgList = Object.values(data).map(choice => ({
        id: choice.id,
        name: choice.name,
    }));

    if (isLoading) {
        return null;
    }
    return (
        <SelectInput
            source="organizationName"
            label="resources.applications.fields.selectOrganization"
            choices={orgList}
            validate={required()}
            className={selectInputClasses.SelectInput}
            onChange={e => props.onChange(e.target.value)}
        />
    );
};
