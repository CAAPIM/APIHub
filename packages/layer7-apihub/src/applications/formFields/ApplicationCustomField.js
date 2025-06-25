// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useEffect, useMemo } from 'react';
import { useGetList, useTranslate } from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import { Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { CustomFieldInput } from '../../ui';

const useSelectInputStyles = makeStyles()({
    SelectInput: {
        width: '100%',
    },
});
const useLabelStyles = makeStyles()(theme => ({
    label: {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.5rem',
    },
}));

export const ApplicationCustomField = props => {
    const { fields, type } = props;
    const isEdit = type === 'EDIT';
    return (
        <>
            {isEdit && <EditCustomFieldData source="cf" fields={fields} />}
            {!isEdit && <CreateCustomField source="cf" />}
        </>
    );
};

export const EditCustomFieldData = ({ fields, disabled }) => {
    const { data, isLoading, isSuccess } = useGetList('customFields', {
        meta: {
            entityName: 'APPLICATION',
            status: 'ENABLED',
        },
    });

    const { classes: selectInputClasses } = useSelectInputStyles();
    const { classes: labelClasses } = useLabelStyles();
    const translate = useTranslate();
    const { setValue } = useFormContext();

    useEffect(() => {
        if (isSuccess) {
            setValue(
                'customFieldsArr',
                data.map(customFields => customFields.id)
            );
        }
    }, [isSuccess, data]);

    // Merging all CustomFields and application > customfields values.
    const mergedData = useMemo(() => {
        if (data) {
            return data.map(item => ({
                ...item,
                ...fields.find(
                    itmInner => itmInner.customFieldUuid === item.Uuid
                ),
            }));
        }
        return [];
    }, [data, fields]);

    if (isLoading || data?.length === 0) {
        return null;
    }
    return (
        <div>
            <span id="customField" classes={labelClasses}>
                {translate('resources.applications.fields.customField')}
            </span>
            {mergedData.length === 0 ? (
                <Typography>
                    {translate('resources.applications.fields.noCustomFields')}
                </Typography>
            ) : (
                mergedData.map(item => (
                    <CustomFieldInput
                        disabled={disabled}
                        key={item.customFieldUuid}
                        // source is required to properly link the label to the input
                        source={item.customFieldUuid}
                        customField={item}
                        className={selectInputClasses.SelectInput}
                        defaultValue={item.value}
                    />
                ))
            )}
        </div>
    );
};

export const CreateCustomField = () => {
    const { data, isLoading, error } = useGetList('customFields');
    const { classes: selectInputClasses } = useSelectInputStyles();
    const { classes: labelClasses } = useLabelStyles();
    const translate = useTranslate();
    if (error || isLoading || data.length === 0) {
        return null;
    }

    return (
        <div>
            <span id="customField" classes={labelClasses}>
                {translate('resources.applications.fields.customField')}
            </span>
            {data.length === 0 ? (
                <Typography>
                    {translate('resources.applications.fields.noCustomFields')}
                </Typography>
            ) : (
                data.map(customField => (
                    <CustomFieldInput
                        key={customField.uuid}
                        // source is required to properly link the label to the input
                        source={customField.uuid}
                        customField={customField}
                        className={selectInputClasses.SelectInput}
                    />
                ))
            )}
        </div>
    );
};
