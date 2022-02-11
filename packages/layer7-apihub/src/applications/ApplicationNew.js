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
    useCreate,
    CRUD_CREATE,
} from 'react-admin';
import { useRefresh, useTranslate, linkToRecord } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { getUserOrganizations, isOrgBoundUser } from '../userContexts';
import { useApiHub } from '../ApiHubContext';
import { getFetchJson } from '../fetchUtils';
import { ApplicationToolbar } from './ApplicationToolbar';
import { ApiSelector } from './ApiSelector';
import {
    OrganizationSelectInput,
    ApplicationCustomField,
    KeySecretSelectInput,
} from './formFields';
import { useLayer7Notify } from '../useLayer7Notify';
import { OneTimePasswordDialog } from './OneTimePasswordDialog';

export const ApplicationNew = ({ userContext, toolbarProps }) => {
    const classes = useStyles();
    const labelClasses = useLabelStyles();
    const history = useHistory();
    const { hasAccessibleOrgs, activeOrg } = getUserOrganizations(userContext);
    const [showOrgList, setShowOrgList] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [keySecret, setKeySecret] = useState(null);
    const [applicationId, setApplicationId] = useState(null);
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [create, { loading, error }] = useCreate('applications');
    const notify = useLayer7Notify();
    const refresh = useRefresh();
    const translate = useTranslate();

    const initialValues = {
        applicationName: '',
        description: '',
        organizationName: activeOrg?.name || '',
        oAuthCallbackUrl: '',
        oAuthScope: '',
        oAuthType: 'public',
        sharedSecret: null,
    };
    useEffect(() => {
        if (!isOrgBoundUser(userContext) && !hasAccessibleOrgs) {
            setShowOrgList(true);
        } else {
            setShowOrgList(false);
            setSelectedOrganization(activeOrg?.uuid);
        }
    }, [activeOrg, hasAccessibleOrgs, userContext]);

    const onSubmit = form => {
        const {
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
            q,
            ...rest
        } = form;

        const customFieldsArr = Object.entries(rest).map(([key, value]) => {
            return {
                Uuid: '{{GENERATED_UUID}}',
                EntityUuid: '{{GENERATED_UUID}}',
                CustomFieldUuid: key,
                Value: value,
            };
        });

        let payload = {
            Name: applicationName,
            Description: description,
            OrganizationUuid: selectedOrganization,
            OauthCallbackUrl: oAuthCallbackUrl,
            OauthScope: oAuthScope,
            OauthType: oAuthType,
            Uuid: '{{GENERATED_GUID}}',
            ApiIds: { results: ApiIds },
            ApiApiPlanIds: { results: ApiApiPlanIds },
            ApiGroupIds: { results: ApiGroupIds },
            CustomFieldValues: {
                results: customFieldsArr,
            },
            ...(sharedSecret
                ? { ShouldHash: sharedSecret === 'hashedsecret' }
                : {}),
        };

        create(
            {
                payload: { data: payload },
            },
            {
                action: CRUD_CREATE,
                onSuccess: ({ data }) => {
                    notify(
                        'resources.applications.notifications.create_success'
                    );
                    if (payload.ShouldHash) {
                        setKeySecret(data.keySecret);
                        setApplicationId(data.id);
                        setShowDialog(true);
                        refresh();
                    } else {
                        history.push(
                            linkToRecord('/applications', data.id, 'show')
                        );
                    }
                },
                onFailure: error => {
                    notify(
                        error ||
                            'resources.applications.notifications.create_error',
                        'error'
                    );
                },
            }
        );
    };

    return (
        <Grid className={classes.root} container spacing={3}>
            <Grid container item md={8} sm={12}>
                <SimpleForm
                    className={classes.form}
                    save={onSubmit}
                    initialValues={initialValues}
                    toolbar={<ApplicationToolbar {...toolbarProps} />}
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
                    <Labeled
                        // On <Labeled />, this will translate in a correct `for` attribute on the label
                        id="applicationName"
                        label="resources.applications.fields.applicationInformation"
                        classes={labelClasses}
                        className={classes.field}
                    ></Labeled>
                    {showOrgList && (
                        <OrganizationSelectInput
                            onChange={setSelectedOrganization}
                            source="organizationName"
                        />
                    )}
                    <TextInput
                        source="description"
                        type="text"
                        label="resources.applications.fields.description"
                        variant="filled"
                        multiline
                        fullWidth
                    />
                    <ApplicationCustomField className={classes.field} />
                    <Labeled
                        label="resources.applications.fields.apiManagement"
                        classes={labelClasses}
                        className={classes.field}
                    ></Labeled>

                    <ApiSelector
                        orgUuid={selectedOrganization}
                        source="selected"
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
                        choices={[
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
                    <KeySecretSelectInput source="sharedSecret" />
                </SimpleForm>
                {showDialog && (
                    <OneTimePasswordDialog
                        id={applicationId}
                        keySecret={keySecret}
                    />
                )}
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
    },
}));
