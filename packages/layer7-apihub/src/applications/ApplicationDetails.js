// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useEffect, useState } from 'react';
import {
    Labeled,
    TextField,
    useGetList,
    useGetRecordId,
    useRecordContext,
} from 'react-admin';
import { useDataProvider, useTranslate } from 'react-admin';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import { makeStyles } from 'tss-react/mui';
import sortBy from 'lodash/sortBy';
import get from 'lodash/get';
import { useQuery } from '@tanstack/react-query';

import { useUserContext } from '../userContexts';
import { ApplicationApisList } from './ApplicationApisList';
import { ApplicationDetailsOverviewField } from './ApplicationDetailsOverviewField';
import { ApplicationDetailsKeyClient } from './ApplicationDetailsKeyClient';
import CollapsiblePanel from './CollapsiblePanel';
import { isPublisher, isOrgAdmin, isOrgBoundUser } from '../userContexts';
import { useLayer7Notify } from '../useLayer7Notify';
import { ApplicationCertificatesPanel } from './ApplicationCertificatesPanel';

export const ApplicationDetails = () => {
    const { classes } = useStyles();
    const { classes: gridClasses } = useGridStyles();
    const { classes: contentLabelClasses } = useContentStyles();
    const { classes: applicationDetailsOverviewClasses } =
        useApplicationDetailsOverviewStyles();
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const notify = useLayer7Notify();
    const [userContext] = useUserContext();
    const canEdit = isPublisher(userContext) || isOrgAdmin(userContext);
    const isOrgUser = isOrgBoundUser(userContext);
    const [apiIds, setApiIds] = useState([]);
    const [apiGroupIds, setApiGroupIds] = useState([]);
    const [appCertificates, setAppCertificates] = useState([]);

    const [apiKeys, setApiKeys] = useState([]);
    const [customFieldsMap, setCustomFieldsMap] = useState({});
    const record = useRecordContext();
    const id = useGetRecordId();

    const {
        data: apiKeysData,
        isSuccess: fetchApiKeysIsSuccess,
        isError: fetchApiKeysIsError,
        error: fetchApiKeysError,
    } = useGetList('apiKeys', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'createTs', order: 'DESC' },
        meta: {
            applicationUuid: id,
        },
    });

    useEffect(() => {
        if (fetchApiKeysIsSuccess) {
            setApiKeys(sortBy(apiKeysData, ({ defaultKey }) => !defaultKey));
        }
        if (fetchApiKeysIsError) {
            notify(fetchApiKeysError);
        }
    }, [
        fetchApiKeysIsSuccess,
        fetchApiKeysIsError,
        fetchApiKeysError,
        notify,
        apiKeysData,
    ]);

    const {
        data: customFieldsData,
        isSuccess: fetchCustomFieldsIsSuccess,
        isError: fetchCustomFieldsIsError,
        error: fetchCustomFieldsError,
    } = useGetList('customFields', {
        meta: {
            entityName: 'APPLICATION',
            status: 'ENABLED',
        },
    });

    useEffect(() => {
        if (fetchCustomFieldsIsSuccess) {
            const fieldsMap = {};
            customFieldsData.map(item => (fieldsMap[item.id] = item.name));
            setCustomFieldsMap(fieldsMap);
        }
        if (fetchCustomFieldsIsError) {
            notify(fetchCustomFieldsError);
        }
    }, [
        fetchCustomFieldsIsSuccess,
        customFieldsData,
        fetchCustomFieldsError,
        fetchCustomFieldsIsError,
        notify,
    ]);

    const {
        data: applicationCertsData,
        isSuccess: fetchApplicationCertsIsSuccess,
        isError: fetchApplicationCertsIsError,
        error: fetchApplicationCertsError,
    } = useGetList('applicationCertificates', {
        meta: { applicationUuid: id },
    });

    useEffect(() => {
        if (fetchApplicationCertsIsSuccess) {
            setAppCertificates(applicationCertsData);
        }
        if (fetchApplicationCertsIsError) {
            notify(fetchApplicationCertsError);
        }
    }, [
        fetchApplicationCertsIsSuccess,
        applicationCertsData,
        fetchApplicationCertsIsError,
        notify,
        fetchApplicationCertsError,
    ]);

    const {
        data: apisData,
        isLoading: isApisDataLoading,
        isSuccess: fetchApisIsSuccess,
        isError: fetchApisIsError,
        error: fetchApisError,
    } = useQuery({
        queryKey: ['applications', 'getApis', { id }],
        queryFn: () => dataProvider.getApis('applications', { id }),
    });

    useEffect(() => {
        if (fetchApisIsSuccess && apisData.data.length > 0) {
            setApiIds(apisData.data.map(item => item.uuid));
        }
        if (fetchApisIsError) {
            notify(fetchApisError);
        }
    }, [
        fetchApisIsSuccess,
        fetchApisIsError,
        fetchApisError,
        apisData,
        notify,
    ]);

    const { data: applicationApiKeyExpirySettings } = useQuery({
        queryKey: ['applications', 'getKeyExpirySettings'],
        queryFn: () => dataProvider.getKeyExpirySettings('applications'),
    });

    const isKeyExpiryEnabled = get(
        applicationApiKeyExpirySettings,
        'data.enabled',
        false
    );
    // get api groups data
    // const {
    //     data: apiGroupsIdsData,
    //     loading: isApiGroupsIdsDataLoading,
    // } = useQuery({
    //     type: 'getApiGroups',
    //     resource: 'applications',
    //     payload: { id: record.id },
    // });
    const { data: apiGroupsIdsData, isLoading: isApiGroupsIdsDataLoading } =
        useQuery({
            queryKey: ['applications', 'getApiGroups', { id }],
            queryFn: () => dataProvider.getApiGroups('applications', { id }),
            retry: false, // TODO: may need to change, auto refetching since it fails
        });

    useEffect(() => {
        const groupsData = get(apiGroupsIdsData, 'data') || [];
        if (groupsData && groupsData.length > 0) {
            setApiGroupIds(groupsData.map(item => item.uuid));
        }
    }, [apiGroupsIdsData]);

    return (
        <>
            <Grid className={classes.root} container spacing={3}>
                <Grid
                    container
                    item
                    md={12}
                    sm={12}
                    direction="column"
                    classes={gridClasses}
                    className={classes.details}
                >
                    <CollapsiblePanel
                        defaultExpanded
                        label={'resources.applications.fields.overview'}
                    >
                        <Grid container lg={12} md={12} sm={12}>
                            <Grid item container lg={12} md={12} sm={12}>
                                <ApplicationDetailsOverviewField
                                    id="overview"
                                    classes={applicationDetailsOverviewClasses}
                                    canEdit={canEdit}
                                />
                            </Grid>
                            <Grid item container lg={12} md={12} sm={12}>
                                <Grid item lg={6} md={6} sm={6}>
                                    <Typography
                                        variant="h3"
                                        className={classes.subsection}
                                    >
                                        {translate(
                                            'resources.applications.fields.details'
                                        )}
                                    </Typography>
                                    {!isOrgUser && (
                                        <Labeled
                                            // On <Labeled />, this will translate in a correct `for` attribute on the label
                                            label="resources.applications.fields.organization"
                                            classes={contentLabelClasses}
                                            className={classes.mainField}
                                        >
                                            <TextField
                                                id="organizationName"
                                                source="organizationName"
                                            />
                                        </Labeled>
                                    )}
                                    {record && record.description && (
                                        <Labeled
                                            // On <Labeled />, this will translate in a correct `for` attribute on the label
                                            label="resources.applications.fields.description"
                                            classes={contentLabelClasses}
                                            className={classes.mainField}
                                        >
                                            <Typography
                                                variant="body2"
                                                className={classes.fieldContent}
                                            >
                                                <span id="description">
                                                    {record.description}
                                                </span>
                                            </Typography>
                                        </Labeled>
                                    )}
                                </Grid>
                                <Grid item lg={6} md={6} sm={6}>
                                    <Typography
                                        variant="h3"
                                        className={classes.subsection}
                                    >
                                        {translate(
                                            'resources.applications.fields.customField'
                                        )}
                                    </Typography>
                                    {record &&
                                        record.customFieldValues &&
                                        record.customFieldValues.map(item => (
                                            <Labeled
                                                // On <Labeled />, this will translate in a correct `for` attribute on the label
                                                label={
                                                    customFieldsMap[
                                                        item.customFieldUuid
                                                    ] || item.customFieldUuid
                                                }
                                                key={item.customFieldUuid}
                                                classes={classes}
                                                className={classes.field}
                                            >
                                                <TextField
                                                    record={item}
                                                    source="value"
                                                />
                                            </Labeled>
                                        ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </CollapsiblePanel>
                </Grid>
                <Grid
                    container
                    item
                    md={12}
                    sm={12}
                    direction="column"
                    classes={gridClasses}
                    className={classes.details}
                >
                    {(apiIds.length > 0 || apiGroupIds.length > 0) &&
                        !isApisDataLoading &&
                        !isApiGroupsIdsDataLoading && (
                            <Grid className={classes.root} container>
                                <Grid
                                    item
                                    container
                                    direction="row"
                                    justifyContent="center"
                                    md={12}
                                    sm={12}
                                >
                                    <ApplicationApisList
                                        apiIds={apiIds}
                                        apiGroupIds={apiGroupIds}
                                        application={record}
                                    />
                                </Grid>
                            </Grid>
                        )}
                </Grid>
                <Grid
                    container
                    item
                    md={12}
                    sm={12}
                    direction="column"
                    classes={gridClasses}
                    className={classes.configuration}
                    justifyContent="flex-start"
                >
                    <CollapsiblePanel
                        defaultExpanded
                        label={'resources.applications.fields.certificates'}
                    >
                        <ApplicationCertificatesPanel
                            allowAddCertificate={false}
                            appCertificates={appCertificates}
                            assignedCertName={''}
                            certFileName={''}
                            fetchApplicationCerts={() => {}}
                            getErrorMessageFromError={() => {}}
                            isSubmitRequest={false}
                            application={record}
                            reloadForm={() => {}}
                            setUploadedCertFile={() => {}}
                            uploadedCertFile={() => {}}
                        />
                    </CollapsiblePanel>
                </Grid>
                <Grid
                    container
                    item
                    md={12}
                    sm={12}
                    direction="column"
                    classes={gridClasses}
                    className={classes.configuration}
                    justifyContent="flex-start"
                >
                    <Grid item>
                        <Typography variant="h3" className={classes.subtitle}>
                            {translate(
                                'resources.applications.fields.authCredentials'
                            )}
                        </Typography>
                    </Grid>
                    <Divider />
                    <List className={classes.mainField}>
                        {apiKeys.map(apiKey => (
                            <ApplicationDetailsKeyClient
                                appCertificates={appCertificates}
                                id={apiKey.id}
                                key={apiKey.id}
                                data={apiKey}
                                includeSecret={true}
                                isKeyExpiryEnabled={isKeyExpiryEnabled}
                                labelClasses={contentLabelClasses}
                            />
                        ))}
                    </List>
                </Grid>
            </Grid>
        </>
    );
};

const useStyles = makeStyles({ name: 'Layer7ApplicationDetails' })(theme => ({
    root: {
        display: 'flex',
        fontFamily: theme.typography.body2.fontFamily,
        fontSize: theme.typography.caption.fontSize,
        margin: theme.spacing(0),
        width: '100%',
    },
    details: {
        padding: `${theme.spacing(1)} ${theme.spacing(3)} !important`,
    },
    configuration: {
        padding: `${theme.spacing(1)} ${theme.spacing(3)} !important`,
    },
    subsection: {
        color: '#333333',
        fontWeight: 600,
        fontSize: '18px',
    },
    subtitle: {
        color: theme.palette.primary.main || '#333333',
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '21px',
        lineHeight: '22px',
        margin: theme.spacing(1, 0, 1, 0),
    },
    field: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(1),
        minWidth: '100px',
        width: '100%',
    },
    label: {
        color: theme.palette.primary.textHub || '#333333',
        fontFamily: theme.typography.textHub,
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 'bold',
        lineHeight: '22px',
        transform: 'unset',
    },
    mainField: {
        minWidth: '100px',
        padding: 0,
        width: '100%',
    },
    fieldValue: {
        color: theme.palette.primary.textHub || '#333333',
        fontFamily: theme.typography.textHub,
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 'normal',
        lineHeight: '20px',
    },
    type: {
        textTransform: 'uppercase',
    },
    icon: {
        fontSize: '1rem',
    },
    chip: {
        marginLeft: theme.spacing(1),
        height: theme.spacing(3),
    },
}));

const useApplicationDetailsOverviewStyles = makeStyles()(theme => ({
    markdown: {
        overflowY: 'scroll',
        height: '200px',
        paddingRight: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
}));

const useContentStyles = makeStyles()(theme => ({
    label: {
        color: theme.palette.primary.textHub || '#333333',
        fontFamily: theme.typography.textHub,
        fontWeight: 700,
        fontSize: '14px',
        lineHeight: '22px',
        margin: theme.spacing(1, 0, 1, 0),
        transform: 'unset',
    },
}));

const useGridStyles = makeStyles()(() => ({
    root: {
        borderBottom: 'none',
    },
}));
