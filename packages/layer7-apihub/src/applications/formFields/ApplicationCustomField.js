import React from 'react';
import { useGetList, useTranslate } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { Labeled } from 'react-admin';
import { useForm } from 'react-final-form';
import { CustomFieldInput } from '../../ui/CustomFieldInput';

const useSelectInputStyles = makeStyles(theme => ({
    SelectInput: {
        width: '100%',
    },
}));
const useLabelStyles = makeStyles(theme => ({
    label: {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.5rem',
    },
}));

export const ApplicationCustomField = props => {
    const { fields, type, ...rest } = props;
    const isEdit = type === 'EDIT';
    return (
        <>
            {isEdit && <EditCustomFieldData source="cf" fields={fields} />}
            {!isEdit && <CreateCustomField source="cf" />}
        </>
    );
};

export const EditCustomFieldData = ({ fields, type, ...rest }) => {
    const { ids = [], data, loaded, error } = useGetList('customFields');
    const selectInputClasses = useSelectInputStyles();
    const labelClasses = useLabelStyles();
    const translate = useTranslate();
    const form = useForm();
    if (ids.length === 0) {
        return null;
    }

    // Merging all CustomFields and application > customfields values.
    const mergedData = Object.values(data).map((item, i) => ({
        ...item,
        ...fields.find(itmInner => itmInner.CustomFieldUuid === item.id),
    }));

    form.change('CustomFieldsArr', Array.from(ids));

    return (
        <div>
            <Labeled
                id="customField"
                label="resources.applications.fields.customField"
                classes={labelClasses}
            ></Labeled>
            {mergedData.length === 0 ? (
                <Typography>
                    {translate('resources.applications.fields.noCustomFields')}
                </Typography>
            ) : (
                mergedData.map(item => (
                    <CustomFieldInput
                        key={item.id}
                        // source is required to properly link the label to the input
                        source={item.id}
                        customField={item}
                        className={selectInputClasses.SelectInput}
                        initialValue={item.Value}
                    />
                ))
            )}
        </div>
    );
};

export const CreateCustomField = () => {
    const { ids = [], data, loaded, error } = useGetList('customFields');
    const selectInputClasses = useSelectInputStyles();
    const labelClasses = useLabelStyles();
    const translate = useTranslate();
    if (error || !loaded || ids.length === 0) {
        return null;
    }

    return (
        <div>
            <Labeled
                id="customField"
                label="resources.applications.fields.customField"
                classes={labelClasses}
                //className={classes.field}
            ></Labeled>
            {ids.length === 0 ? (
                <Typography>
                    {translate('resources.applications.fields.noCustomFields')}
                </Typography>
            ) : (
                ids.map(id => (
                    <CustomFieldInput
                        key={id}
                        // source is required to properly link the label to the input
                        source={data[id].id}
                        customField={data[id]}
                        className={selectInputClasses.SelectInput}
                    />
                ))
            )}
        </div>
    );
};
