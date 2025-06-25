// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState, useEffect, useMemo } from 'react';
import {
    minLength,
    maxLength,
    required,
    SimpleForm,
    TextInput,
    useDataProvider,
    useRecordContext,
    useGetList,
    useGetRecordId,
    useCreate,
    useCreatePath,
    useRefresh,
} from 'react-admin';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import every from 'lodash/every';
import isUndefined from 'lodash/isUndefined';
import isEmpty from 'lodash/isEmpty';
import { useTranslate, useUpdate, useLoading } from 'react-admin';
import { CircularProgress, Dialog, DialogContent, Grid } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import difference from 'lodash/difference';
import findIndex from 'lodash/findIndex';
import keys from 'lodash/keys';
import sortBy from 'lodash/sortBy';
import { isOrgBoundUser } from '../userContexts';
import CollapsiblePanel from './CollapsiblePanel';
import { ApplicationToolbar } from './ApplicationToolbar';
import { ApiSelector } from './ApiSelector';
import { ApplicationCertificatesPanel } from './ApplicationCertificatesPanel';
import { ApplicationKeysPanel } from './ApplicationKeysPanel';
import { EditCustomFieldData } from './formFields';
import { useLayer7Notify } from '../useLayer7Notify';
import ToggleSwitchInput from '../ui/ToggleSwitchInput';
import { UnSavedChangesDialog } from './UnSavedChangesDialog';

import { OneTimePasswordDialog } from './OneTimePasswordDialog';
import {
    isEditCustomFieldsPending,
    isEditAPIPlansPending,
    isEditAPIsPending,
    isEditAPIGroupsPending,
    isEditAPIKeysPending,
    isEditDetailsPending,
} from './isApplicationPending';
import { useWorkFlowConfigurations } from './useWorkFlowConfigurations';
import useApplicationUniqueCheck from './useApplicationUniqueCheck';
import { ConfirmDialog } from '../ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useFormContext, useWatch } from 'react-hook-form';

const PANEL_ID_NONE = 'PANEL_ID_NONE';
const PANEL_ID_DETAILS = 'PANEL_ID_DETAILS';
const PANEL_ID_APIS = 'PANEL_ID_APIS';
const PANEL_ID_CERTIFICATES = 'PANEL_ID_CERTIFICATES';
const PANEL_ID_KEY_PREFIX = 'PANEL_ID_KEY_PREFIX_';
const NEW_KEY = 'NEW_KEY';
const APPLICATION_STATUS_INCOMPLETE = 'INCOMPLETE';
const APPLICATION_STATUS_REJECTED = 'REJECTED';
const NOTIFICATION_TYPE_ERROR = 'error';

export const ApplicationEditView = ({ userContext }) => {
    const { classes } = useStyles();
    const { classes: labelClasses } = useLabelStyles();
    const record = useRecordContext();
    const id = useGetRecordId();
    const refresh = useRefresh();
    const [apiKeys, setApiKeys] = useState(record.apiKey);
    const selectedOrganization = record.organizationUuid;
    const [update] = useUpdate();
    const [create] = useCreate();
    const notify = useLayer7Notify();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const [apiPlansEnabled, setApiPlansEnabled] = useState(false);
    const [allowSelectHashing, setAllowSelectHashing] = useState(false);
    const [secretHashing, setSecretHashing] = useState('PLAIN');
    const [activePanelID, setActivePanelID] = useState(PANEL_ID_NONE);
    const [selectedPanelID, setSelectedPanelID] = useState(PANEL_ID_NONE);
    const [apiIds, setApiIds] = useState([]);
    const [apiApiPlanIds, setApiApiPlanIds] = useState([]);
    const [apiGroupIds, setApiGroupIds] = useState([]);
    const loading = useLoading();
    const navigate = useNavigate();
    // using apiSelectorDataLoaded to render ApiSelector once all the required data is pulled,
    // else, duplicates were added to selectedItems
    const [apiSelectorDataLoaded, setApiSelectorDataLoaded] = useState(false);
    const [handlingCancel, setHandlingCancel] = useState(false);

    const [addedKey, setAddedKey] = useState({});
    const [openSecretDialog, setOpenSecretDialog] = useState(false);

    const [showRegPendingPopup, setShowRegPendingPopup] = useState(false);

    const [isSectionModified, setIsSectionModified] = useState(false);
    const [invalidData, setInvalidData] = useState(false);
    const [isDetailsModified, setIsDetailsModified] = useState(false);
    const [isCustomFieldModified, setIsCustomFieldModified] = useState(false);
    const [showSaveDialog, setShowSaveDialog] = useState(false);

    const workFlowConfigurations = useWorkFlowConfigurations();
    const [isEditAppDetailsLocked, setIsEditAppDetailsLocked] = useState(false);
    const [isEditCustomFieldsLocked, setIsEditCustomFieldsLocked] =
        useState(false);
    const [isEditApiKeysLocked, setIsEditApiKeysLocked] = useState(false);
    const [isEditApisLocked, setIsEditApisLocked] = useState(false);
    const [isEditApiPlansLocked, setIsEditApiPlansLocked] = useState(false);
    const [isEditApiGroupsLocked, setIsEditApiGroupsLocked] = useState(false);
    const [appCertificates, setAppCertificates] = useState([]);
    const [updatedKeyDetails, setUpdatedKeyDetails] = useState();
    const [uploadedCertFile, setUploadedCertFile] = useState();
    const [certFileName, setCertFileName] = useState('');
    const [assignedCertName, setAssignedCertName] = useState('');
    const isAppIncomplete = record.status === APPLICATION_STATUS_INCOMPLETE;
    const isAppRejected = record.status === APPLICATION_STATUS_REJECTED;
    const [authProviders, setAuthProviders] = useState([]);
    const createPath = useCreatePath();

    const { mutateAsync: fetchApiPlanFeatureFlagAsync } = useMutation({
        mutationFn: () => dataProvider.getApiPlansFeatureFlag('apiPlans'),
    });

    const fetchData = async () => {
        const { data } = await fetchApiPlanFeatureFlagAsync();
        setApiPlansEnabled(data.value === 'true');
        if (data.value === 'true') {
            fetchApiApiPlans({ id });
        } else {
            fetchApis({ id });
            fetchApiGroups({ id });
        }
        fetchApiKeys({
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'createTs', order: 'DESC' },
            meta: {
                applicationUuid: id,
            },
        });
        fetchOAuthClients({
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'createTs', order: 'DESC' },
            meta: {
                applicationUuid: id,
            },
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const { data: authProvidersData, isSuccess: fetchAuthProvidersIsSuccess } =
        useGetList('authProviders');

    useEffect(() => {
        if (fetchAuthProvidersIsSuccess) {
            setAuthProviders(authProvidersData);
        }
    }, [fetchAuthProvidersIsSuccess, authProvidersData]);

    const { data: applicationCertsData, refetch: fetchApplicationCerts } =
        useGetList('applicationCertificates', {
            meta: { applicationUuid: id },
        });

    useEffect(() => {
        if (applicationCertsData) {
            setAppCertificates(applicationCertsData);
        }
    }, [applicationCertsData]);

    const { data: appRequestStatus = {} } = useQuery({
        queryKey: ['applications', 'getRequestStatus', { id }],
        queryFn: () => dataProvider.getRequestStatus('applications', { id }),
    });

    useEffect(() => {
        if (record.status !== 'INCOMPLETE') {
            setActivePanelID(PANEL_ID_DETAILS);
            setSelectedPanelID(PANEL_ID_DETAILS);
        }
        const appStatus = !isEmpty(appRequestStatus)
            ? get(appRequestStatus, 'data')
            : {};
        setIsEditAppDetailsLocked(
            isEditDetailsPending(userContext, appStatus, record.status)
        );
        setIsEditCustomFieldsLocked(
            isEditCustomFieldsPending(userContext, appStatus, record.status)
        );
        setIsEditApiKeysLocked(
            isEditAPIKeysPending(userContext, appStatus, record.status)
        );
        if (apiPlansEnabled) {
            setIsEditApisLocked(
                isEditAPIPlansPending(userContext, appStatus, record.status)
            );
        } else {
            setIsEditApisLocked(
                isEditAPIsPending(userContext, appStatus, record.status)
            );
        }
        setIsEditApiPlansLocked(
            isEditAPIPlansPending(userContext, appStatus, record.status)
        );
        if (!apiPlansEnabled) {
            setIsEditApiGroupsLocked(
                isEditAPIGroupsPending(userContext, appStatus, record.status)
            );
        }
    }, [
        apiPlansEnabled,
        appRequestStatus,
        record.status,
        userContext,
        workFlowConfigurations,
    ]);

    const [appName, setAppName] = useState('');
    const isNameUnique = useApplicationUniqueCheck(
        appName,
        selectedOrganization,
        id
    );
    const [clientMetadataMap, setClientMetadataMap] = useState({});

    const updateAppNameWithDebounce = debounce(name => {
        setAppName(name);
    }, 1000);

    const onNameChange = evt => {
        const name = get(evt, 'target.value');
        updateAppNameWithDebounce(name);
    };

    const validateAppEdit = () => {
        if (!isUndefined(isNameUnique) && !isNameUnique) {
            return {
                applicationName: translate(
                    'resources.applications.validation.error_application_name_not_unique'
                ),
            };
        }
        return {};
    };

    const {
        mutate: fetchApis,
        data: apisData,
        isLoading: isApisDataLoading,
    } = useMutation({
        mutationFn: ({ id }) => dataProvider.getApis('applications', { id }),
        onSuccess: response => {
            const { data } = response;
            setApiIds(data.map(item => item.uuid));
        },
    });

    const {
        mutate: fetchApiApiPlans,
        data: apiApiPlanIdsData,
        isLoading: isApiPlansDataLoading,
    } = useMutation({
        mutationFn: ({ id }) =>
            dataProvider.getApiApiPlanIds('applications', { id }),
        onSuccess: response => {
            const { data } = response;
            setApiApiPlanIds(
                data.map(item => ({
                    ApiUuid: item.uuid,
                    ApiPlanUuid: item.apiPlanUuid,
                }))
            );
            setApiIds(data.map(item => item.uuid));
        },
    });

    const {
        mutate: fetchApiGroups,
        data: apiGroupsIdsData,
        isLoading: isApiGroupsIdsDataLoading,
    } = useMutation({
        mutationFn: ({ id }) =>
            dataProvider.getApiGroups('applications', { id }),
        onSuccess: ({ data }) => {
            setApiGroupIds(data.map(item => item.uuid));
        },
    });

    useEffect(() => {
        if (apiPlansEnabled) {
            if (!isApiPlansDataLoading && apiApiPlanIds && apiIds) {
                setApiSelectorDataLoaded(true);
            }
        } else {
            if (
                !isApisDataLoading &&
                !isApiGroupsIdsDataLoading &&
                apisData &&
                apiGroupsIdsData
            ) {
                setApiSelectorDataLoaded(true);
            }
        }
    }, [
        apiPlansEnabled,
        isApisDataLoading,
        isApiPlansDataLoading,
        isApiGroupsIdsDataLoading,
        apisData,
        apiApiPlanIdsData,
        apiGroupsIdsData,
    ]);

    const {
        data: secretHashMetaResponse,
        isSuccess: fetchSecretHashMetaDataIsSuccess,
    } = useQuery({
        queryKey: ['applications', 'getSecretHashMetadata'],
        queryFn: () => dataProvider.getSecretHashMetadata('applications'),
    });

    useEffect(() => {
        if (
            secretHashMetaResponse &&
            secretHashMetaResponse.data &&
            secretHashMetaResponse.data.value
        ) {
            const isPlainTextAllowed = get(
                JSON.parse(secretHashMetaResponse.data.value),
                'plaintextAllowed'
            );
            setSecretHashing('HASHED');
            setAllowSelectHashing(isPlainTextAllowed);
        } else {
            setAllowSelectHashing(false);
        }
    }, [secretHashMetaResponse, fetchSecretHashMetaDataIsSuccess]);

    const {
        mutate: fetchOAuthClients,
        data: oAuthClientsData,
        isLoading: oAuthClientsIsLoading,
    } = useMutation({
        mutationFn: ({ filter, pagination, sort, meta }) =>
            dataProvider.getList('oAuthClients', {
                filter,
                pagination,
                sort,
                meta,
            }),
    });

    const {
        mutate: fetchApiKeys,
        data: apiKeysData,
        isLoading: apiKeysIsLoading,
        isSuccess: fetchApisKeyIsSuccess,
    } = useMutation({
        mutationFn: ({ filter, pagination, sort, meta }) =>
            dataProvider.getList('apiKeys', {
                filter,
                pagination,
                sort,
                meta,
            }),
        onSuccess: ({ data }) => {
            data.forEach(client =>
                setClientMetadataMap(prev => ({
                    ...prev,
                    [client.clientId]: client,
                }))
            );
        },
    });

    useEffect(() => {
        if (
            apiKeysData &&
            oAuthClientsData &&
            apiKeysData.data.length > 0 &&
            oAuthClientsData.data.length > 0
        ) {
            oAuthClientsData.data.forEach(oAuthclient => {
                const oAuthApiKey = apiKeysData.data.find(
                    key => key.apiKey === oAuthclient.clientId
                );
                oAuthApiKey['clientMetadata'] = JSON.stringify(
                    oAuthclient.clientMetadata,
                    null,
                    2
                );
            });
        }
        if (fetchApisKeyIsSuccess) {
            setApiKeys(
                sortBy(apiKeysData.data, ({ defaultKey }) => !defaultKey)
            );
        }
    }, [apiKeysData, fetchApisKeyIsSuccess, oAuthClientsData]);

    const customFieldsMap = {};
    const appCustomFields = record.customFieldValues || [];
    appCustomFields.forEach(item => {
        customFieldsMap[item.customFieldUuid] = item.value;
    });

    const initialValues = useMemo(() => {
        const customFieldsMap = {};
        const appCustomFields = record.customFieldValues || [];
        const customFieldsArr = [];
        appCustomFields.forEach(item => {
            customFieldsMap[item.customFieldUuid] = item.value;
            customFieldsArr.push(item.customFieldUuid);
        });

        return {
            id: record.id,
            applicationName: record.name,
            description: record.description,
            organizationName: record.organizationName,
            oAuthCallbackUrl: record.OauthCallbackUrl || '',
            oAuthType: record.OauthType?.toLowerCase() || 'PUBLIC',
            sharedSecret: null,
            selected: record.ApiIds?.results,
            customFields: record.customFieldValues || [],
            customFieldsArr: customFieldsArr,
            apiKey: record.apiKey,
            apiKeys: [],
            status: record.status,
            clientRegistrationType: 'PORTAL',
            clientDefDescription: '',
            clientMetadata: '',
            // using statusBoolValue to hold boolean
            // value of status when the status is either ENABLED or DISABLED
            statusBoolValue: record.status === 'ENABLED',
            ...customFieldsMap,
        };
    }, [record]);

    // update key
    const onKeySubmit = (form, apiKey) => {
        const apiKeyObject =
            apiKey === NEW_KEY
                ? form.apiKeys.find(item => !item.apiKey)
                : form.apiKeys.find(item => item.apiKey === apiKey);
        // Note about keySecret and keySecretHashed
        // Due to some issue, It is not updating apiKey objects in the form. so, assigning values on form and using the.
        let keyData = {};
        const isAuthMethodSecret = apiKeyObject.authMethod === 'SECRET';
        if (isAuthMethodSecret) {
            keyData = {
                applicationUuid: apiKeyObject.applicationUuid,
                authMethod: apiKeyObject.authMethod,
                defaultKey: apiKeyObject.defaultKey,
                name: apiKeyObject.name,
                oauthCallbackUrl: apiKeyObject.oauthCallbackUrl,
                oauthScope: apiKeyObject.oauthScope,
                oauthType: apiKeyObject.oauthType,
                status: apiKeyObject.status,
            };
        } else {
            keyData = {
                applicationUuid: apiKeyObject.applicationUuid,
                authMethod: apiKeyObject.authMethod,
                defaultKey: apiKeyObject.defaultKey,
                name: apiKeyObject.name,
                status: apiKeyObject.status,
                authProviderUuid: apiKeyObject.authProviderUuid,
            };
        }
        if (apiKey === NEW_KEY) {
            if (keyData.authMethod === 'NONE') {
                keyData = {
                    ...keyData,
                    defaultKey: form.apiKeys.length === 1,
                };
                if (apiKeyObject.clientRegistrationType === 'EXTERNAL') {
                    addApiKey(record.id, {
                        ...keyData,
                        apiKey: apiKeyObject.userProvidedApiKey,
                    });
                } else {
                    // clientRegistrationType is PORTAL_DCR
                    addOAuthClient(record.id, {
                        ...keyData,
                        clientMetadata: apiKeyObject.clientMetadata
                            ? JSON.parse(apiKeyObject.clientMetadata)
                            : '',
                    });
                }
            } else {
                addApiKey(record.id, {
                    ...keyData,
                    ...(isAuthMethodSecret && {
                        keySecretHashed: secretHashing === 'HASHED',
                    }),
                    defaultKey: form.apiKeys.length === 1,
                });
            }
        } else {
            if (!isEditApiKeysLocked) {
                let keyType = 'api-keys';
                if (apiKeyObject.clientRegistrationType === 'PORTAL_DCR') {
                    keyType = 'oauth-clients';
                    keyData = {
                        ...keyData,
                        clientMetadata: JSON.parse(apiKeyObject.clientMetadata),
                        clientId: apiKeyObject.apiKey,
                    };
                }
                update(
                    'applications',
                    {
                        id: apiKeyObject.applicationUuid,
                        data: keyData,
                        meta: {
                            keyId: apiKeyObject.apiKey,
                            options: {
                                type: keyType,
                            },
                        },
                    },
                    {
                        onSuccess: handleFormSaveSuccess,
                        onError: handleFormSaveFailure,
                    }
                );
            }
        }
    };

    // add key
    const addApiKey = async (appUuid, data) => {
        const { keySecretHashed } = data;
        await create(
            'apiKeys',
            {
                data,
                meta: {
                    appUuid,
                },
            },
            {
                returnPromise: true,
                onError: error => {
                    let errorMessage = getErrorMessageFromError(error);
                    notify(
                        `${translate(
                            'resources.applications.notifications.edit_error'
                        )}, ${errorMessage}`,
                        NOTIFICATION_TYPE_ERROR
                    );
                    reloadForm();
                },
                onSuccess: data => {
                    setActivePanelID(PANEL_ID_NONE);
                    setAddingKeyEntry(false);
                    if (keySecretHashed) {
                        setAddedKey(data);
                        setOpenSecretDialog(true);
                    } else {
                        if (
                            isOrgBoundUser(userContext) &&
                            !isAppIncomplete &&
                            workFlowConfigurations.editApplicationRequestWorkflowStatus ===
                                'ENABLED'
                        ) {
                            notify(
                                translate(
                                    'resources.applications.notifications.key_create_request_success'
                                )
                            );
                        } else {
                            notify(
                                translate(
                                    'resources.applications.notifications.key_create_success'
                                )
                            );
                        }

                        if (isAppIncomplete) {
                            reloadForm();
                        } else {
                            navigateToShowView();
                        }
                    }
                },
            }
        );
    };

    const addOAuthClient = async (appUuid, data) => {
        await create(
            'oAuthClients',
            {
                data,
                meta: {
                    appUuid,
                },
            },
            {
                returnPromise: true,
                onError: error => {
                    let errorMessage = getErrorMessageFromError(error);
                    notify(
                        `${translate(
                            'resources.applications.notifications.edit_error'
                        )} ${errorMessage}`,
                        NOTIFICATION_TYPE_ERROR
                    );
                    reloadForm();
                },
                onSuccess: ({ data }) => {
                    setActivePanelID(PANEL_ID_NONE);
                    setAddingKeyEntry(false);
                    const { status } = data;
                    if (status === 'ENABLED') {
                        setAddedKey({
                            ...data,
                            apiKey: data.clientId,
                            keySecret: data.clientSecret,
                        });
                        setOpenSecretDialog(true);
                    } else {
                        setShowRegPendingPopup(true);
                        if (isAppIncomplete) {
                            reloadForm();
                        } else {
                            navigateToShowView();
                        }
                    }
                },
            }
        );
    };

    // save details
    const onDetailsSubmit = async form => {
        const promises = [];
        if (!isEditAppDetailsLocked && isDetailsModified) {
            promises.push(
                await new Promise((resolve, reject) => {
                    let appStatus = form.status;
                    // set app state only if the original state is ENABLED or DISABLED
                    if (
                        form.status === 'ENABLED' ||
                        form.status === 'DISABLED'
                    ) {
                        appStatus = form.statusBoolValue
                            ? 'ENABLED'
                            : 'DISABLED';
                    }
                    update(
                        'applications',
                        {
                            id: form.id,
                            data: {
                                name: form.applicationName,
                                uuid: form.id,
                                description: form.description,
                                organizationUuid: record.organizationUuid,
                                organizationName: form.organizationName,
                                status: appStatus,
                            },
                            meta: {
                                options: {
                                    type: 'details',
                                },
                            },
                        },
                        {
                            onSuccess: resolve,
                            onError: reject,
                        }
                    );
                })
            );
        }
        if (!isEditCustomFieldsLocked && isCustomFieldModified) {
            const customFieldsArr = form.customFieldsArr || [];
            const customFieldValues = customFieldsArr.map(item => {
                return {
                    customFieldUuid: item,
                    value: form[item] ? form[item] : '',
                };
            });
            promises.push(
                await new Promise((resolve, reject) => {
                    update(
                        'applications',
                        {
                            id: form.id,
                            data: customFieldValues,
                            meta: {
                                options: {
                                    type: 'custom-fields',
                                },
                            },
                        },
                        {
                            onSuccess: resolve,
                            onError: reject,
                        }
                    );
                })
            );
        }
        Promise.allSettled(promises).then(values => {
            if (every(values, value => value.status === 'fulfilled')) {
                handleFormSaveSuccess();
            } else {
                const errors = [];
                values.forEach(item => {
                    if (item.status === 'rejected') {
                        errors.push(item.reason);
                    }
                });
                handleMultipleFormSaveFailure(errors);
            }
        });
    };

    // save apis
    const onApisSubmit = async form => {
        const promises = [];
        if (apiPlansEnabled) {
            const apiApiPlanIds = form.ApiApiPlanIds || [];
            const apiApiPlans = apiApiPlanIds.map(item => ({
                uuid: item.ApiUuid,
                apiPlanUuid: item.ApiPlanUuid,
            }));
            if (!isEditApiPlansLocked) {
                promises.push(
                    await new Promise((resolve, reject) => {
                        update(
                            'applications',
                            {
                                id: form.id,
                                data: apiApiPlans,
                                meta: {
                                    options: {
                                        type: 'api-plans',
                                    },
                                },
                            },
                            {
                                onSuccess: resolve,
                                onError: reject,
                            }
                        );
                    })
                );
            }
        } else {
            const apiGroupIds = form.ApiGroupIds || [];
            const apiGroups = apiGroupIds.map(item => ({
                uuid: item,
            }));
            if (!isEditApiGroupsLocked) {
                promises.push(
                    await new Promise((resolve, reject) => {
                        update(
                            'applications',
                            {
                                id: form.id,
                                data: apiGroups,
                                meta: {
                                    options: {
                                        type: 'api-groups',
                                    },
                                },
                            },
                            {
                                onSuccess: resolve,
                                onError: reject,
                            }
                        );
                    })
                );
            }
            const apiIds = form.apiIds || [];
            const apis = apiIds.map(item => ({
                uuid: item,
            }));
            if (!isEditApisLocked) {
                promises.push(
                    await new Promise((resolve, reject) => {
                        update(
                            'applications',
                            {
                                id: form.id,
                                data: apis,
                                meta: {
                                    options: {
                                        type: 'apis',
                                    },
                                },
                            },
                            {
                                onSuccess: resolve,
                                onError: reject,
                            }
                        );
                    })
                );
            }
        }
        Promise.allSettled(promises).then(values => {
            if (every(values, value => value.status === 'fulfilled')) {
                handleFormSaveSuccess();
            } else {
                const errors = [];
                values.forEach(item => {
                    if (item.status === 'rejected') {
                        errors.push(item.reason);
                    }
                });
                handleMultipleFormSaveFailure(errors);
            }
        });
    };

    const reloadForm = () => {
        setIsSectionModified(false);
        setIsDetailsModified(false);
        setIsCustomFieldModified(false);
        setApiSelectorDataLoaded(false);
        refresh();
        fetchData();
    };

    const handleFormSaveSuccess = () => {
        if (
            isOrgBoundUser(userContext) &&
            !isAppIncomplete &&
            workFlowConfigurations.editApplicationRequestWorkflowStatus ===
                'ENABLED'
        ) {
            notify(
                translate(
                    'resources.applications.notifications.edit_request_success'
                )
            );
        } else {
            notify(
                translate('resources.applications.notifications.edit_success')
            );
        }
        if (isAppIncomplete) {
            reloadForm();
        } else {
            navigateToShowView();
        }
    };
    const handleFormPublishSuccess = () => {
        if (
            isOrgBoundUser(userContext) &&
            isAppIncomplete &&
            workFlowConfigurations.applicationRequestWorkflowStatus ===
                'ENABLED'
        ) {
            notify(
                translate(
                    'resources.applications.notifications.publish_request_success'
                )
            );
        } else {
            notify(
                translate(
                    'resources.applications.notifications.publish_success'
                )
            );
        }
        navigateToShowView();
    };
    const [addingKeyEntry, setAddingKeyEntry] = useState(false);

    const onFormSubmit = form => {
        if (activePanelID === PANEL_ID_DETAILS) {
            onDetailsSubmit(form);
        } else if (activePanelID === PANEL_ID_APIS) {
            onApisSubmit(form);
        } else if (activePanelID.startsWith(PANEL_ID_KEY_PREFIX)) {
            onKeySubmit(form, activePanelID.replace(PANEL_ID_KEY_PREFIX, ''));
        }
    };

    const getErrorMessageFromError = error => {
        const validationErrors = get(
            error,
            'body.error.detail.validationErrors',
            []
        );
        let errorMessage = '';
        if (validationErrors.length > 0) {
            errorMessage = validationErrors
                .map(item => `${get(item, 'error')} [${get(item, 'field')}].`)
                .join(';');
        } else {
            errorMessage = get(error, 'body.error.detail.userErrorMessage', '');
        }
        return errorMessage;
    };

    const handleMultipleFormSaveFailure = (errors = []) => {
        let errorMessages = [];
        errors.forEach(error => {
            errorMessages.push(getErrorMessageFromError(error));
        });
        notify(
            translate('resources.applications.notifications.edit_error') +
                ' ' +
                errorMessages.join(','),
            NOTIFICATION_TYPE_ERROR
        );
    };

    const handleFormSaveFailure = error => {
        let errorMessage = getErrorMessageFromError(error);
        notify(
            translate('resources.applications.notifications.edit_error') +
                ' ' +
                errorMessage,
            NOTIFICATION_TYPE_ERROR
        );
    };

    const onPublish = () => {
        update(
            'applications',
            {
                id: record.id,
                meta: {
                    options: {
                        type: 'publish',
                    },
                },
                data: { id: record.id },
            },
            {
                onSuccess: handleFormPublishSuccess,
                onError: handleFormSaveFailure,
            }
        );
    };

    const navigateToShowView = () => {
        navigate(
            createPath({
                resource: 'applications',
                type: 'show',
                id,
            })
        );
    };

    const onCancel = () => {
        if (isSectionModified) {
            setHandlingCancel(true);
            setShowSaveDialog(true);
        } else {
            navigateToShowView();
        }
    };

    const onPanelClick = (expanded, panelID) => {
        if (isSectionModified) {
            if (panelID !== activePanelID) {
                setSelectedPanelID(panelID);
            } else {
                setSelectedPanelID(PANEL_ID_NONE);
            }
            setHandlingCancel(false);
            setShowSaveDialog(true);
        } else {
            if (panelID !== activePanelID) {
                setActivePanelID(panelID);
                setUpdatedKeyDetails();
            } else {
                setActivePanelID(PANEL_ID_NONE);
            }
        }
    };

    const {
        mutate: completeRegistration,
        data: dcrCreatedKey,
        error: completeRegistrationError,
    } = useMutation({
        mutationFn: ({ appId, apiKeyId }) =>
            dataProvider.completeRegistration('oAuthClients', {
                clientId: apiKeyId,
                appUuid: appId,
            }),
    });

    useEffect(() => {
        if (dcrCreatedKey && dcrCreatedKey.clientId) {
            setAddedKey({
                apiKey: dcrCreatedKey.clientId,
                keySecret: dcrCreatedKey.clientSecret,
                clientMetadata: dcrCreatedKey.clientMetadata,
            });
            setOpenSecretDialog(true);
        }
    }, [dcrCreatedKey]);

    useEffect(() => {
        if (completeRegistrationError) {
            handleFormSaveFailure([completeRegistrationError]);
        }
    }, [completeRegistrationError, handleFormSaveFailure]);

    const handleCloseAddKey = () => {
        setOpenSecretDialog(false);
        notify(
            translate('resources.applications.notifications.key_create_success')
        );
        if (isAppIncomplete) {
            reloadForm();
        } else {
            navigateToShowView();
        }
    };

    const handleUnsavedChangesDialogCancel = () => {
        setShowSaveDialog(false);
    };

    const handleUnsavedChangesDialogYes = form => {
        setShowSaveDialog(false);
        if (handlingCancel) {
            navigateToShowView();
        } else {
            form.reset();
            reloadForm();
            setActivePanelID(selectedPanelID);
        }
    };

    const showPublishBtn = isAppIncomplete || isAppRejected;

    const appHasApis = () => {
        if (apiPlansEnabled) {
            return apiApiPlanIds && apiApiPlanIds.length > 0;
        } else {
            return (
                (apiIds && apiIds.length > 0) ||
                (apiGroupIds && apiGroupIds.length > 0)
            );
        }
    };

    const apisSummaryLabelContent =
        isAppIncomplete && !appHasApis() && activePanelID !== PANEL_ID_APIS ? (
            <p className={classes.lockText}>
                {translate('resources.applications.status.apis_help_text')}
            </p>
        ) : (
            <span />
        );

    const getAPIsSectionLabel = () => {
        let basicLabel = translate('resources.applications.fields.apis');
        let suffix = '';
        if (apiPlansEnabled) {
            if (apiApiPlanIds && apiApiPlanIds.length > 0) {
                suffix = translate('resources.applications.fields.apisCount', {
                    count: apiApiPlanIds.length,
                });
            }
        } else {
            let suffixComponents = [];
            if (apiIds && apiIds.length > 0) {
                suffixComponents.push(
                    translate('resources.applications.fields.apisCount', {
                        count: apiIds.length,
                    })
                );
            }
            if (apiGroupIds && apiGroupIds.length > 0) {
                suffixComponents.push(
                    translate('resources.applications.fields.apiGroupsCount', {
                        count: apiGroupIds.length,
                    })
                );
            }
            suffix = suffixComponents.join(', ');
        }
        if (suffix) {
            return `${basicLabel} (${suffix})`;
        } else {
            return basicLabel;
        }
    };

    const disableSaveButton = !isSectionModified || invalidData;
    const disablePublishButton =
        isSectionModified || !appHasApis() || (apiKeys && apiKeys.length === 0);
    const apisSectionLabel = getAPIsSectionLabel();

    const isEditRequest =
        isOrgBoundUser(userContext) &&
        !isAppIncomplete &&
        workFlowConfigurations.editApplicationRequestWorkflowStatus ===
            'ENABLED';

    return (
        <Grid className={classes.root} container spacing={3}>
            <Dialog open={loading} aria-labelledby="form-dialog-title">
                <DialogContent>
                    <CircularProgress />
                </DialogContent>
            </Dialog>
            <Dialog
                open={openSecretDialog}
                onClose={handleCloseAddKey}
                aria-labelledby="form-dialog-title"
            >
                <OneTimePasswordDialog
                    id={record.id}
                    handleClose={handleCloseAddKey}
                    keySecret={addedKey.keySecret}
                    apiKey={addedKey.apiKey}
                    clientMetadata={addedKey.clientMetadata}
                    isPlainTextKey={addedKey.keySecretHashed}
                />
            </Dialog>
            <ConfirmDialog
                title={translate('resources.apikeys.reg_pending_title')}
                content={translate(
                    `resources.apikeys.${
                        isAppIncomplete
                            ? 'reg_pending_incomplete_content'
                            : 'reg_pending_wf_content'
                    }`
                )}
                buttonConfirm={translate('resources.apikeys.actions.close')}
                open={showRegPendingPopup}
                onConfirm={() => {
                    setShowRegPendingPopup(false);
                    reloadForm();
                }}
            />
            <Grid container item md={12} sm={12}>
                <SimpleForm
                    className={classes.form}
                    onSubmit={onFormSubmit}
                    defaultValues={initialValues}
                    mode="onBlur"
                    reValidateMode="onBlur"
                    toolbar={
                        <ApplicationToolbar
                            type="EDIT"
                            buttonLabel="resources.applications.actions.save"
                            showPublishBtn={showPublishBtn}
                            disableSaveButton={disableSaveButton}
                            disablePublishButton={disablePublishButton}
                            onPublish={onPublish}
                            onCancel={onCancel}
                        />
                    }
                    validate={validateAppEdit}
                >
                    <CollapsiblePanel
                        data-apim-test="details-panel"
                        expanded={activePanelID === PANEL_ID_DETAILS}
                        label={'resources.applications.fields.overview'}
                        onChange={(evt, expanded) =>
                            onPanelClick(expanded, PANEL_ID_DETAILS)
                        }
                    >
                        {(isEditAppDetailsLocked ||
                            isEditCustomFieldsLocked) && (
                            <p className={classes.lockText}>
                                {translate(
                                    'resources.applications.status.partial_lock'
                                )}
                            </p>
                        )}
                        <span
                            id="applicationName"
                            classes={labelClasses}
                            className={classes.field}
                        >
                            {translate('resources.applications.fields.details')}
                        </span>
                        <TextInput
                            data-apim-test="applicationName"
                            disabled={isEditAppDetailsLocked}
                            source="applicationName"
                            type="text"
                            label="resources.applications.fields.name"
                            variant="filled"
                            fullWidth
                            helperText="resources.applications.validation.application_name_caption"
                            validate={[
                                required(),
                                minLength(2),
                                maxLength(50),
                                validateAppEdit,
                            ]}
                            onChange={onNameChange}
                        />
                        {(initialValues.status === 'ENABLED' ||
                            initialValues.status === 'DISABLED') && (
                            <ToggleSwitchInput
                                disabled={isEditAppDetailsLocked}
                                label="resources.applications.fields.status"
                                source="statusBoolValue"
                                classes={labelClasses}
                                className={classes.field}
                            />
                        )}
                        <TextInput
                            source="organizationName"
                            type="text"
                            label="resources.applications.fields.organization"
                            variant="filled"
                            fullWidth
                            disabled
                        />
                        <TextInput
                            disabled={isEditAppDetailsLocked}
                            source="description"
                            type="text"
                            label="resources.applications.fields.description"
                            variant="filled"
                            multiline
                            fullWidth
                        />
                        {activePanelID === PANEL_ID_DETAILS && (
                            <EditCustomFieldData
                                disabled={isEditCustomFieldsLocked}
                                fields={initialValues.customFields}
                                className={classes.field}
                            />
                        )}
                    </CollapsiblePanel>
                    <CollapsiblePanel
                        data-apim-test="apis-panel"
                        expanded={activePanelID === PANEL_ID_APIS}
                        label={apisSectionLabel}
                        labelComponent={apisSummaryLabelContent}
                        onChange={(evt, expanded) =>
                            onPanelClick(expanded, PANEL_ID_APIS)
                        }
                    >
                        {(apiPlansEnabled
                            ? isEditApiPlansLocked
                            : isEditApisLocked || isEditApiGroupsLocked) && (
                            <p className={classes.lockText}>
                                {translate(
                                    'resources.applications.status.partial_lock'
                                )}
                            </p>
                        )}
                        {apiSelectorDataLoaded && (
                            <ApiSelector
                                orgUuid={selectedOrganization}
                                source="selected"
                                apiIds={apiIds}
                                ApiApiPlanIds={apiApiPlanIds}
                                ApiGroupIds={apiGroupIds}
                                apiPlansEnabled={apiPlansEnabled}
                                application={record}
                                isEditApisLocked={isEditApisLocked}
                                isEditApiPlansLocked={isEditApiPlansLocked}
                                isEditApiGroupsLocked={isEditApiGroupsLocked}
                            />
                        )}
                    </CollapsiblePanel>
                    <CollapsiblePanel
                        data-apim-test="details-panel"
                        expanded={activePanelID === PANEL_ID_CERTIFICATES}
                        label={'resources.applications.fields.certificates'}
                        onChange={(evt, expanded) =>
                            onPanelClick(expanded, PANEL_ID_CERTIFICATES)
                        }
                    >
                        <ApplicationCertificatesPanel
                            allowAddCertificate={true}
                            appCertificates={appCertificates}
                            application={record}
                            assignedCertName={assignedCertName}
                            certFileName={certFileName}
                            fetchApplicationCerts={fetchApplicationCerts}
                            getErrorMessageFromError={getErrorMessageFromError}
                            isSubmitRequest={isEditRequest}
                            reloadForm={reloadForm}
                            setUploadedCertFile={setUploadedCertFile}
                            uploadedCertFile={uploadedCertFile}
                        />
                    </CollapsiblePanel>
                    <Grid item container md={12} sm={12}>
                        <ApplicationKeysPanel
                            activePanelID={activePanelID}
                            addingKeyEntry={addingKeyEntry}
                            allowSelectHashing={allowSelectHashing}
                            apiKeys={apiKeys}
                            apiKeysLoading={
                                apiKeysIsLoading || oAuthClientsIsLoading
                            }
                            appCertificates={appCertificates}
                            application={record}
                            authProviders={authProviders}
                            initialValues={initialValues}
                            isEditApiKeysLocked={isEditApiKeysLocked}
                            isSectionModified={isSectionModified}
                            navigateToShowView={navigateToShowView}
                            onPanelClick={onPanelClick}
                            reloadForm={reloadForm}
                            setActivePanelID={setActivePanelID}
                            setAddingKeyEntry={setAddingKeyEntry}
                            setSecretHashing={setSecretHashing}
                            setUpdatedKeyDetails={setUpdatedKeyDetails}
                            updatedKeyDetails={updatedKeyDetails}
                            userContext={userContext}
                            completeRegistration={completeRegistration}
                        />
                    </Grid>
                    <FormSpy
                        activePanelID={activePanelID}
                        initialValues={initialValues}
                        setIsDetailsModified={setIsDetailsModified}
                        setIsCustomFieldModified={setIsCustomFieldModified}
                        apiPlansEnabled={apiPlansEnabled}
                        apiApiPlanIds={apiApiPlanIds}
                        addingKeyEntry={addingKeyEntry}
                        apiGroupIds={apiGroupIds}
                        apiIds={apiIds}
                        apiKeys={apiKeys}
                        setUploadedCertFile={setUploadedCertFile}
                        certFileName={certFileName}
                        setCertFileName={setCertFileName}
                        uploadedCertFile={uploadedCertFile}
                        assignedCertName={assignedCertName}
                        setAssignedCertName={setAssignedCertName}
                        setIsSectionModified={setIsSectionModified}
                        setInvalidData={setInvalidData}
                    />
                    {showSaveDialog && (
                        <UnSavedChangesDialog
                            onOk={handleUnsavedChangesDialogYes}
                            onCancel={handleUnsavedChangesDialogCancel}
                            show={showSaveDialog}
                        />
                    )}
                </SimpleForm>
            </Grid>
        </Grid>
    );
};

const useStyles = makeStyles({ name: 'Layer7ApplicationDetails' })(theme => ({
    root: {
        display: 'flex',
        fontFamily: theme.typography.body2.fontFamily,
        fontSize: theme.typography.caption.fontSize,
        margin: theme.spacing(0),
    },
    details: {},
    configuration: {},
    subtitle: {
        color: theme.palette.primary.main || '#333333',
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '21px',
        lineHeight: '22px',
        margin: theme.spacing(1, 0, 1, 0),
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
        marginBottom: 80,
        marginRight: '20px',
    },
    customFields: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.5rem',
    },
    apiSelector: {
        marginBottom: theme.spacing(1),
    },
    addButton: {
        color: 'blue',
    },
    lockText: {
        color: theme.palette.primary.textHub,
        fontFamily: theme.typography.body1.fontFamily,
        fontSize: theme.typography.body1.fontSize,
    },
}));

const FormSpy = ({
    activePanelID,
    initialValues,
    setIsDetailsModified,
    setIsCustomFieldModified,
    apiPlansEnabled,
    apiApiPlanIds,
    addingKeyEntry,
    apiGroupIds,
    apiIds,
    apiKeys,
    setUploadedCertFile,
    certFileName,
    setCertFileName,
    uploadedCertFile,
    assignedCertName,
    setAssignedCertName,
    setIsSectionModified,
    setInvalidData,
}) => {
    const values = useWatch();
    const convertFileToBase64 = file =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file.rawFile);
        });

    const onChange = async ({ values }) => {
        let sectionModified = false;
        let invalidData = false;
        if (activePanelID === PANEL_ID_DETAILS) {
            let detailsModified = false;
            const {
                applicationName,
                description,
                statusBoolValue,
                customFieldsArr = [],
            } = values;
            if (
                initialValues.applicationName !== applicationName ||
                initialValues.description !== description ||
                initialValues.statusBoolValue !== statusBoolValue
            ) {
                detailsModified = true;
            }
            setIsDetailsModified(detailsModified);

            let customFieldsModified = false;
            const initialMap = {};
            const initialCustomFields = initialValues.customFields || [];
            initialCustomFields.forEach(item => {
                initialMap[item.customFieldUuid] = item.value;
            });
            const valuesMap = {};
            customFieldsArr.forEach(item => {
                if (!isUndefined(values[item])) {
                    valuesMap[item] = values[item];
                }
            });
            const keysArr = keys(initialMap);
            const valuesKeysArr = keys(valuesMap);
            if (keysArr.length !== valuesKeysArr.length) {
                customFieldsModified = true;
            } else {
                keysArr.forEach(key => {
                    if (initialMap[key] !== valuesMap[key]) {
                        customFieldsModified = true;
                    }
                });
            }
            setIsCustomFieldModified(customFieldsModified);

            sectionModified = detailsModified || customFieldsModified;
        } else if (activePanelID === PANEL_ID_APIS) {
            if (apiPlansEnabled) {
                const initialApiApiPlansMap = {};
                apiApiPlanIds.forEach(item => {
                    initialApiApiPlansMap[item.ApiUuid] = item.ApiPlanUuid;
                });
                const modifiedApiApiPlansMap = {};
                const valuesApiApiPlanIds = values.ApiApiPlanIds || [];
                // no change if values.ApiApiPlanIds is empty
                if (valuesApiApiPlanIds.length > 0) {
                    valuesApiApiPlanIds.forEach(item => {
                        modifiedApiApiPlansMap[item.ApiUuid] = item.ApiPlanUuid;
                    });
                    const initialkeys = keys(initialApiApiPlansMap);
                    const modifiedKeys = keys(modifiedApiApiPlansMap);
                    const diffKeys = difference(initialkeys, modifiedKeys);
                    if (
                        initialkeys.length === modifiedKeys.length &&
                        diffKeys.length === 0
                    ) {
                        initialkeys.forEach(id => {
                            if (
                                initialApiApiPlansMap[id] !==
                                modifiedApiApiPlansMap[id]
                            ) {
                                sectionModified = true;
                            }
                        });
                    } else {
                        sectionModified = true;
                    }
                }
            } else {
                const modifiedApiGroupIds = values.ApiGroupIds || [];
                const modifiedApiIds = values.apiIds || [];
                const diffApiGroupIds = difference(
                    modifiedApiGroupIds,
                    apiGroupIds
                );
                const diffApiIds = difference(modifiedApiIds, apiIds);
                if (
                    apiGroupIds.length !== modifiedApiGroupIds.length ||
                    diffApiGroupIds.length !== 0 ||
                    apiIds.length !== modifiedApiIds.length ||
                    diffApiIds.length !== 0
                ) {
                    sectionModified = true;
                }
            }
        } else if (activePanelID.startsWith(PANEL_ID_KEY_PREFIX)) {
            const activeAPIKeyID = activePanelID.replace(
                PANEL_ID_KEY_PREFIX,
                ''
            );

            if (activeAPIKeyID === NEW_KEY) {
                if (addingKeyEntry) {
                    const valuesKeyObj =
                        values.apiKeys[values.apiKeys.length - 1];
                    // show save bar only by setting sectionModified to true only
                    // when it is not empty
                    if (valuesKeyObj) {
                        if (get(valuesKeyObj, 'authMethod') === 'SECRET') {
                            sectionModified = !!(
                                get(valuesKeyObj, 'name') ||
                                get(valuesKeyObj, 'oauthCallbackUrl') ||
                                get(valuesKeyObj, 'oauthScope')
                            );
                        } else {
                            sectionModified = !!(
                                get(valuesKeyObj, 'name') ||
                                get(valuesKeyObj, 'clientMetadata')
                            );
                            if (get(valuesKeyObj, 'clientMetadata')) {
                                try {
                                    JSON.parse(
                                        get(valuesKeyObj, 'clientMetadata')
                                    );
                                } catch (e) {
                                    invalidData = true;
                                }
                            }
                        }
                    }
                }
            } else {
                const keyIndex = findIndex(
                    apiKeys,
                    item => item.apiKey === activeAPIKeyID
                );
                const valuesKeyObj = values.apiKeys[keyIndex];
                const initialKeyObj = apiKeys[keyIndex];
                // keySecret and keySecretHashed are excluded
                // as they are updated with patch now
                if (initialKeyObj) {
                    if (
                        initialKeyObj.name !== get(valuesKeyObj, 'name') ||
                        initialKeyObj.oauthCallbackUrl !==
                            get(valuesKeyObj, 'oauthCallbackUrl') ||
                        initialKeyObj.oauthScope !==
                            get(valuesKeyObj, 'oauthScope') ||
                        initialKeyObj.oauthType !==
                            get(valuesKeyObj, 'oauthType') ||
                        initialKeyObj.status !== get(valuesKeyObj, 'status') ||
                        initialKeyObj.clientMetadata !==
                            get(valuesKeyObj, 'clientMetadata')
                    ) {
                        sectionModified = true;
                    }
                    if (get(valuesKeyObj, 'clientMetadata')) {
                        try {
                            JSON.parse(get(valuesKeyObj, 'clientMetadata'));
                        } catch (e) {
                            invalidData = true;
                        }
                    }
                }
            }
        }
        if (values.uploadedCertFile) {
            const base64EncodedFile = await convertFileToBase64(
                values.uploadedCertFile
            );
            const certContentArray = base64EncodedFile.split(',');
            const base64 =
                certContentArray.length > 1 ? certContentArray[1] : '';
            setUploadedCertFile(base64);
            const fileName = values.uploadedCertFile.rawFile.name;
            if (certFileName !== fileName) {
                setCertFileName(fileName);
            }
        } else if (uploadedCertFile) {
            setUploadedCertFile();
        }
        if (values.givenCertName !== assignedCertName) {
            setAssignedCertName(values.givenCertName);
        }
        setIsSectionModified(sectionModified);
        setInvalidData(invalidData);
    };

    useEffect(() => {
        onChange({ values });
    }, [values]);

    return <span />;
};

const useLabelStyles = makeStyles()(theme => ({
    label: {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.5rem',
        width: '100%',
    },
}));
