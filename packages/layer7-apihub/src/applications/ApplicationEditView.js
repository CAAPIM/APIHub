import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    SimpleForm,
    TextInput,
    required,
    minLength,
    maxLength,
    SelectInput,
    Labeled,
    RadioButtonGroupInput,
} from 'react-admin';
import {
    useRefresh,
    useTranslate,
    linkToRecord,
    CRUD_UPDATE,
    useUpdate,
} from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { isPublisher, isOrgAdmin, isOrgBoundUser } from '../userContexts';
import { getFetchJson } from '../fetchUtils';
import { ApplicationToolbar } from './ApplicationToolbar';
import { ApiSelector } from './ApiSelector';
import { ApplicationKeyClient } from './ApplicationKeyClient';
import { ApplicationKeySecret } from './ApplicationKeySecret';
import { EditCustomFieldData } from './formFields';
import { useLayer7Notify } from '../useLayer7Notify';
import ToggleSwitchInput from '../ui/ToggleSwitchInput';
import { isEditApplicationDisabled } from './isApplicationPending';

export const ApplicationEditView = ({
    userContext,
    toolbarProps,
    record,
    ...props
}) => {
    const classes = useStyles();
    const labelClasses = useLabelStyles();
    const history = useHistory();
    const [apiKey, setApiKey] = useState(record.apiKey);
    const [applicationId, setApplicationId] = useState(props.id);
    const selectedOrganization = record.organizationUuid;
    const [statusLabel, setStatusLabel] = useState(record.status);
    const [update, { loading, error }] = useUpdate('applications');
    const notify = useLayer7Notify();
    const refresh = useRefresh();
    const translate = useTranslate();

    const isEditDisabled = isEditApplicationDisabled(userContext, record);
    const handleStatusChange = value => {
        setStatusLabel(value);
    };
    if (!record || !record.ApiIds) {
        return null;
    }

    const initialValues = {
        id: record.id,
        applicationName: record.name,
        description: record.description,
        organizationName: record.organizationName,
        oAuthCallbackUrl: record.OauthCallbackUrl || '',
        oAuthScope: record.OauthScope || '',
        oAuthType: record.OauthType?.toLowerCase() || 'none',
        sharedSecret: null,
        selected: record.ApiIds?.results,
        customFields: record.CustomFieldValues?.results || [],
        apiKey: record.apiKey,
        keySecret: record.keySecret,
        status:
            record.status === 'REJECTED'
                ? record.status
                : record.status === 'ENABLED',
    };

    const onSubmit = form => {
        const {
            id,
            status,
            applicationName,
            description,
            organizationName,
            oAuthCallbackUrl,
            oAuthScope,
            oAuthType,
            sharedSecret,
            ApiIds = [],
            ApiApiPlanIds = [],
            ApiGroupIds = [],
            CustomFieldsArr = [],
            ShouldHash = null,
            keySecret,
            apiKey,
            ...rest
        } = form;

        const CustomFieldValues = CustomFieldsArr.map(item => {
            return {
                Uuid: '{{GENERATED_UUID}}',
                EntityUuid: '{{GENERATED_UUID}}',
                CustomFieldUuid: item,
                Value: rest[item],
            };
        });

        const udpatedStatus = status => {
            return status === 'REJECTED'
                ? status
                : status
                ? 'ENABLED'
                : 'DISABLED';
        };

        let payload = {
            Name: applicationName,
            Description: description,
            OrganizationUuid: selectedOrganization,
            OrganizationName: organizationName,
            OauthCallbackUrl: oAuthCallbackUrl,
            OauthScope: oAuthScope,
            OauthType: oAuthType === 'none' ? null : oAuthType,
            Uuid: id,
            ApiIds: { results: ApiIds },
            ApiApiPlanIds: { results: ApiApiPlanIds },
            ApiGroupIds: { results: ApiGroupIds },
            CustomFieldValues: {
                results: CustomFieldValues,
            },
            KeySecret: keySecret,
            ApiKey: apiKey,
            Status: udpatedStatus(status),
            ShouldHash: ShouldHash,
        };

        //Update Application call
        update(
            {
                payload: { id: payload.Uuid, data: payload },
            },
            {
                action: CRUD_UPDATE,
                onSuccess: ({ data }) => {
                    notify('resources.applications.notifications.edit_success');
                    history.push(
                        linkToRecord('/applications', payload.Uuid, 'show')
                    );
                    refresh();
                },
                onFailure: error => {
                    notify(
                        error ||
                            'resources.applications.notifications.edit_error',
                        'error'
                    );
                },
            }
        );
    };
    return (
        <Grid className={classes.root} container spacing={3}>
            <Grid container item md={9} sm={12}>
                <SimpleForm
                    className={classes.form}
                    save={onSubmit}
                    initialValues={initialValues}
                    toolbar={
                        !isEditDisabled ? (
                            <ApplicationToolbar
                                type="EDIT"
                                buttonLabel="resources.applications.actions.save"
                                {...toolbarProps}
                            />
                        ) : null
                    }
                >
                    <TextInput
                        source="applicationName"
                        type="text"
                        label="resources.applications.fields.name"
                        variant="filled"
                        fullWidth
                        helperText="resources.applications.validation.application_name_caption"
                        validate={[required(), minLength(2), maxLength(50)]}
                    />
                    {record.status !== 'REJECTED' && (
                        <ToggleSwitchInput
                            source="status"
                            label={
                                statusLabel === 'ENABLED' ||
                                statusLabel === true
                                    ? 'resources.applications.status.enabled'
                                    : 'resources.applications.status.disabled'
                            }
                            classes={labelClasses}
                            className={classes.field}
                            onChange={handleStatusChange}
                        />
                    )}
                    <Labeled
                        // On <Labeled />, this will translate in a correct `for` attribute on the label
                        id="applicationName"
                        label="resources.applications.fields.applicationInformation"
                        classes={labelClasses}
                        className={classes.field}
                    ></Labeled>
                    <TextInput
                        source="organizationName"
                        type="text"
                        label="resources.applications.fields.organization"
                        variant="filled"
                        fullWidth
                        disabled
                    />
                    <TextInput
                        source="description"
                        type="text"
                        label="resources.applications.fields.description"
                        variant="filled"
                        multiline
                        fullWidth
                    />
                    <EditCustomFieldData
                        fields={initialValues.customFields}
                        type="EDIT"
                        className={classes.field}
                    />
                    <Labeled
                        label="resources.applications.fields.apiManagement"
                        classes={labelClasses}
                        className={classes.field}
                    ></Labeled>

                    <ApiSelector
                        orgUuid={selectedOrganization}
                        source="selected"
                        application={record}
                    />

                    <Labeled
                        label="resources.applications.fields.authCredentials"
                        classes={labelClasses}
                        className={classes.field}
                    ></Labeled>
                    <TextInput
                        source="oAuthCallbackUrl"
                        type="text"
                        label="resources.applications.fields.callbackUrl"
                        variant="filled"
                        multiline
                        fullWidth
                        helperText="resources.applications.validation.callback_url_caption"
                        validate={[maxLength(2048)]}
                    />
                    <TextInput
                        source="oAuthScope"
                        type="text"
                        label="resources.applications.fields.scope"
                        variant="filled"
                        multiline
                        fullWidth
                        helperText="resources.applications.validation.scope_caption"
                        validate={[maxLength(4000)]}
                    />
                    <RadioButtonGroupInput
                        source="oAuthType"
                        label="resources.applications.fields.type"
                        className={classes.input}
                        required
                        choices={[
                            {
                                id: 'none',
                                name: translate(
                                    'resources.applications.fields.none'
                                ),
                            },
                            {
                                id: 'public',
                                name: translate(
                                    'resources.applications.fields.public'
                                ),
                            },
                            {
                                id: 'confidential',
                                name: translate(
                                    'resources.applications.fields.confidential'
                                ),
                            },
                        ]}
                    />
                    {record.apiKey && (
                        <ApplicationKeyClient
                            id={record.id}
                            data={record}
                            includeSecret={false}
                            labelClasses={labelClasses}
                        />
                    )}
                    {record.keySecret && (
                        <div className={classes.input}>
                            <ApplicationKeySecret
                                source="keySecret"
                                id={record.id}
                                record={record}
                                isEditDisabled={
                                    isEditDisabled ||
                                    record.status === 'DISABLED'
                                }
                                labelClasses={labelClasses}
                            />
                        </div>
                    )}
                </SimpleForm>
            </Grid>
        </Grid>
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'flex',
            fontFamily: theme.typography.body2.fontFamily,
            fontSize: theme.typography.caption.fontSize,
            margin: theme.spacing(0),
        },
        details: {},
        configuration: {},
        subtitle: {
            textTransform: 'uppercase',
            fontWeight: theme.typography.fontWeightBold,
            fontSize: '1rem',
            margin: theme.spacing(1, 1, 2, 1),
        },
        field: {
            marginRight: theme.spacing(1),
            width: '100%',
        },
        type: {
            textTransform: 'uppercase',
        },
        icon: {
            fontSize: '1rem',
        },
        form: {
            flex: 1,
        },
        customFields: {
            display: 'flex',
            flexDirection: 'column',
        },
        label: {
            fontWeight: theme.typography.fontWeightBold,
            fontSize: '1.5rem',
        },
        input: {
            width: '100%',
        },
        apiSelector: {
            marginBottom: theme.spacing(1),
        },
    }),
    {
        name: 'Layer7ApplicationDetails',
    }
);

const useLabelStyles = makeStyles(theme => ({
    label: {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.5rem',
        width: '100%',
    },
}));
