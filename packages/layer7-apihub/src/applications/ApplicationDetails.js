import React, { useEffect, useState } from 'react';
import { Labeled, TextField, useQuery } from 'react-admin';
import { useDataProvider, useMutation, useTranslate } from 'ra-core';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import sortBy from 'lodash/sortBy';
import get from 'lodash/get';

import { useUserContext } from '../userContexts';
import { ApplicationApisList } from './ApplicationApisList';
import { ApplicationDetailsOverviewField } from './ApplicationDetailsOverviewField';
import { ApplicationDetailsKeyClient } from './ApplicationDetailsKeyClient';
import CollapsiblePanel from './CollapsiblePanel';
import { isPublisher, isOrgAdmin, isOrgBoundUser } from '../userContexts';
import { useLayer7Notify } from '../useLayer7Notify';
import { ApplicationCertificatesPanel } from './ApplicationCertificatesPanel';

export const ApplicationDetails = ({ record }) => {
    const classes = useStyles();
    const gridClasses = useGridStyles();
    const contentLabelClasses = useContentStyles();
    const applicationDetailsOverviewClasses = useApplicationDetailsOverviewStyles();
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const notify = useLayer7Notify();

    const [userContext] = useUserContext();
    const canEdit = isPublisher(userContext) || isOrgAdmin(userContext);
    const isOrgUser = isOrgBoundUser(userContext);
    const [apiIds, setApiIds] = useState([]);
    const [apiGroupIds, setApiGroupIds] = useState([]);
    const [appCertificates, setAppCertificates] = useState([]);

    const [apiKeys, setApiKeys] = React.useState([]);
    const [customFieldsMap, setCustomFieldsMap] = React.useState({});
    const fetchApiKeys = async () => {
        const { data } = await dataProvider.getList(
            'apiKeys',
            {
                applicationUuid: record.id,
                pagination: { page: 1, perPage: 100 },
                sort: { field: 'createTs', order: 'DESC' },
            },
            {
                onFailure: error => notify(error),
            }
        );
        setApiKeys(sortBy(data, ({ defaultKey }) => !defaultKey));
    };

    // get application certificates data
    const [fetchApplicationCerts, { data: applicationCertsData }] = useMutation(
        {
            payload: {
                applicationUuid: record.id,
            },
            resource: 'applicationCertificates',
            type: 'getList',
        }
    );

    useEffect(() => {
        fetchApplicationCerts();
    }, []);

    useEffect(() => {
        if (applicationCertsData) {
            setAppCertificates(applicationCertsData);
        }
    }, [applicationCertsData]);

    // get apis data
    const { data: apisData, loading: isApisDataLoading } = useQuery({
        type: 'getApis',
        resource: 'applications',
        payload: { id: record.id },
    });

    const { data: applicationApiKeyExpirySettings } = useQuery({
        type: 'getKeyExpirySettings',
        resource: 'applications',
        payload: {},
    });

    const isKeyExpiryEnabled = get(
        applicationApiKeyExpirySettings,
        'enabled',
        false
    );

    React.useEffect(() => {
        if (apisData && apisData.length > 0) {
            setApiIds(apisData.map(item => item.uuid));
        }
    }, [apisData]);

    // get api groups data
    const {
        data: apiGroupsIdsData,
        loading: isApiGroupsIdsDataLoading,
    } = useQuery({
        type: 'getApiGroups',
        resource: 'applications',
        payload: { id: record.id },
    });
    React.useEffect(() => {
        if (apiGroupsIdsData && apiGroupsIdsData.length > 0) {
            setApiGroupIds(apiGroupsIdsData.map(item => item.uuid));
        }
    }, [apiGroupsIdsData]);

    React.useEffect(() => {
        const fetchCustomFields = async () => {
            const { data } = await dataProvider.getList(
                'customFields',
                {
                    entityName: 'APPLICATION',
                },
                {
                    onFailure: error => notify(error),
                }
            );
            const fieldsMap = {};
            data.map(item => (fieldsMap[item.id] = item.Name));
            setCustomFieldsMap(fieldsMap);
        };
        fetchApiKeys();
        fetchCustomFields();
    }, []);

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
                                    record={record}
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
                                                record={record}
                                                source="organizationName"
                                            />
                                        </Labeled>
                                    )}
                                    {record.description && (
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
                                    {record.customFieldValues &&
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
                                                <div
                                                    className={
                                                        classes.fieldValue
                                                    }
                                                >
                                                    <TextField
                                                        record={item}
                                                        source="value"
                                                    />
                                                </div>
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
                                    justify="center"
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
                    justify="flex-start"
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
                    justify="flex-start"
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
                                appUuid={record.id}
                                id={apiKey.id}
                                key={apiKey.id}
                                data={apiKey}
                                includeSecret={true}
                                isKeyExpiryEnabled={isKeyExpiryEnabled}
                                labelClasses={contentLabelClasses}
                                dataProvider={dataProvider}
                                refreshApiKeys={fetchApiKeys}
                            />
                        ))}
                    </List>
                </Grid>
            </Grid>
        </>
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'flex',
            fontFamily: theme.typography.body2.fontFamily,
            fontSize: theme.typography.caption.fontSize,
            margin: theme.spacing(0),
            width: '100%',
        },
        details: {
            padding: `${theme.spacing(1)}px ${theme.spacing(3)}px !important`,
        },
        configuration: {
            padding: `${theme.spacing(1)}px ${theme.spacing(3)}px !important`,
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
    }),
    {
        name: 'Layer7ApplicationDetails',
    }
);

const useApplicationDetailsOverviewStyles = makeStyles(theme => ({
    markdown: {
        overflowY: 'scroll',
        height: '200px',
        paddingRight: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
}));

const useContentStyles = makeStyles(theme => ({
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

const useGridStyles = makeStyles(theme => ({
    root: {
        borderBottom: 'none',
    },
}));
