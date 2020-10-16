import React from 'react';
import { required, SelectInput } from 'react-admin';
import { useGetList } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';

const useSelectInputStyles = makeStyles({
    SelectInput: {
        width: '100%',
    },
});

export const OrganizationSelectInput = props => {
    const { data = {}, loaded } = useGetList('organizations', {
        page: 1,
        perPage: 200,
    });
    const selectInputClasses = useSelectInputStyles();
    const orgList = Object.values(data).map(choice => ({
        id: choice.id,
        name: choice.name,
    }));

    if (!loaded) {
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
