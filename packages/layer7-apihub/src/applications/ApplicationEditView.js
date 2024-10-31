// Copyright © 2024 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState, useEffect } from 'react';
import {
    Labeled,
    minLength,
    maxLength,
    required,
    SimpleForm,
    TextInput,
    useDataProvider,
    useQuery,
    useRefresh,
} from 'react-admin';
import { useHistory } from 'react-router-dom';
import { FormSpy } from 'react-final-form';

import debounce from 'lodash/debounce';
import get from 'lodash/get';
import every from 'lodash/every';
import isUndefined from 'lodash/isUndefined';
import {
    useTranslate,
    CRUD_UPDATE,
    useUpdate,
    useMutation,
    useLoading,
} from 'ra-core';
import {
    CircularProgress,
    Dialog,
    DialogContent,
    Grid,
    makeStyles,
} from '@material-ui/core';
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

const PANEL_ID_NONE = 'PANEL_ID_NONE';
const PANEL_ID_DETAILS = 'PANEL_ID_DETAILS';
const PANEL_ID_APIS = 'PANEL_ID_APIS';
const PANEL_ID_CERTIFICATES = 'PANEL_ID_CERTIFICATES';
const PANEL_ID_KEY_PREFIX = 'PANEL_ID_KEY_PREFIX_';
const NEW_KEY = 'NEW_KEY';
const APPLICATION_STATUS_INCOMPLETE = 'INCOMPLETE';
const APPLICATION_STATUS_REJECTED = 'REJECTED';
const NOTIFICATION_TYPE_ERROR = 'error';

export const ApplicationEditView = ({
    userContext,
    toolbarProps,
    record,
    ...props
}) => {
    const classes = useStyles();
    const labelClasses = useLabelStyles();
    const [apiKeys, setApiKeys] = useState(record.apiKey);
    const selectedOrganization = record.organizationUuid;
    const [update] = useUpdate('applications');
    const notify = useLayer7Notify();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const [apiPlansEnabled, setApiPlansEnabled] = React.useState(false);
    const [allowSelectHashing, setAllowSelectHashing] = React.useState(false);
    const [secretHashing, setSecretHashing] = React.useState('PLAIN');
    const [activePanelID, setActivePanelID] = useState(PANEL_ID_DETAILS);
    const [selectedPanelID, setSelectedPanelID] = useState(PANEL_ID_DETAILS);
    const [apiIds, setApiIds] = useState([]);
    const [apiApiPlanIds, setApiApiPlanIds] = useState([]);
    const [apiGroupIds, setApiGroupIds] = useState([]);
    const loading = useLoading();
    const history = useHistory();
    // using apiSelectorDataLoaded to render ApiSelector once all the required data is pulled,
    // else, duplicates were added to selectedItems
    const [apiSelectorDataLoaded, setApiSelectorDataLoaded] = useState(false);
    const [handlingCancel, setHandlingCancel] = useState(false);

    const [addedKey, setAddedKey] = useState({});
    const [openSecretDialog, setOpenSecretDialog] = useState(false);

    const [isSectionModified, setIsSectionModified] = useState(false);
    const [isDetailsModified, setIsDetailsModified] = useState(false);
    const [isCustomFieldModified, setIsCustomFieldModified] = useState(false);
    const [showSaveDialog, setShowSaveDialog] = useState(false);

    const workFlowConfigurations = useWorkFlowConfigurations();
    const [isEditAppDetailsLocked, setIsEditAppDetailsLocked] = useState(false);
    const [isEditCustomFieldsLocked, setIsEditCustomFieldsLocked] = useState(
        false
    );
    const [isEditApiKeysLocked, setIsEditApiKeysLocked] = useState(false);
    const [isEditApisLocked, setIsEditApisLocked] = useState(false);
    const [isEditApiPlansLocked, setIsEditApiPlansLocked] = useState(false);
    const [isEditApiGroupsLocked, setIsEditApiGroupsLocked] = useState(false);
    const [appCertificates, setAppCertificates] = useState([]);
    const refresh = useRefresh();
    const [updatedKeyDetails, setUpdatedKeyDetails] = useState();
    const [uploadedCertFile, setUploadedCertFile] = useState();
    const [certFileName, setCertFileName] = useState('');
    const [assignedCertName, setAssignedCertName] = useState('');
    const isAppIncomplete = record.status === APPLICATION_STATUS_INCOMPLETE;
    const isAppRejected = record.status === APPLICATION_STATUS_REJECTED;
    const [authProviders, setAuthProviders] = useState([]);

    const {
        data: apiPlanFeatureFlag,
        loaded: apiPlanFeatureFlagLoaded,
    } = useQuery({
        type: 'getApiPlansFeatureFlag',
        resource: 'apiPlans',
        payload: {},
    });

    React.useEffect(() => {
        (async () => {
            const { data } =
                (await dataProvider.getList('authProviders')) || {};
            setAuthProviders(data);
        })();
    }, [dataProvider]);

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
    }, [fetchApplicationCerts]);

    useEffect(() => {
        if (applicationCertsData) {
            setAppCertificates(applicationCertsData);
        }
    }, [applicationCertsData]);

    React.useEffect(() => {
        if (apiPlanFeatureFlag) {
            setApiPlansEnabled(apiPlanFeatureFlag.value === 'true');
        }
    }, [apiPlanFeatureFlag]);

    // get app requests status
    const { data: appRequestStatus = {} } = useQuery({
        type: 'getRequestStatus',
        resource: 'applications',
        payload: { id: record.id },
    });

    React.useEffect(() => {
        setIsEditAppDetailsLocked(
            isEditDetailsPending(userContext, appRequestStatus, record.status)
        );
        setIsEditCustomFieldsLocked(
            isEditCustomFieldsPending(
                userContext,
                appRequestStatus,
                record.status
            )
        );
        setIsEditApiKeysLocked(
            isEditAPIKeysPending(userContext, appRequestStatus, record.status)
        );
        if (apiPlansEnabled) {
            setIsEditApisLocked(
                isEditAPIPlansPending(
                    userContext,
                    appRequestStatus,
                    record.status
                )
            );
        } else {
            setIsEditApisLocked(
                isEditAPIsPending(userContext, appRequestStatus, record.status)
            );
        }
        setIsEditApiPlansLocked(
            isEditAPIPlansPending(userContext, appRequestStatus, record.status)
        );
        if (!apiPlansEnabled) {
            setIsEditApiGroupsLocked(
                isEditAPIGroupsPending(
                    userContext,
                    appRequestStatus,
                    record.status
                )
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
        record.id
    );

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

    // get apis data
    const [
        fetchApis,
        { data: apisData, loading: isApisDataLoading },
    ] = useMutation({
        type: 'getApis',
        resource: 'applications',
        payload: { id: record.id },
    });
    React.useEffect(() => {
        if (!apiPlansEnabled) {
            if (apisData) {
                setApiIds(apisData.map(item => item.uuid));
            }
        }
    }, [apiPlansEnabled, apisData]);

    // get api plans data
    const [
        fetchApiApiPlans,
        { data: apiApiPlanIdsData, loading: isApiPlansDataLoading },
    ] = useMutation({
        type: 'getApiApiPlanIds',
        resource: 'applications',
        payload: { id: record.id },
    });
    React.useEffect(() => {
        if (apiApiPlanIdsData) {
            setApiApiPlanIds(
                apiApiPlanIdsData.map(item => ({
                    ApiUuid: item.uuid,
                    ApiPlanUuid: item.apiPlanUuid,
                }))
            );
            setApiIds(apiApiPlanIdsData.map(item => item.uuid));
        }
    }, [apiApiPlanIdsData]);

    // get api groups data
    const [
        fetchApiGroups,
        { data: apiGroupsIdsData, loading: isApiGroupsIdsDataLoading },
    ] = useMutation({
        type: 'getApiGroups',
        resource: 'applications',
        payload: { id: record.id },
    });
    React.useEffect(() => {
        if (!isApiGroupsIdsDataLoading && apiGroupsIdsData) {
            setApiGroupIds(apiGroupsIdsData.map(item => item.uuid));
        }
    }, [apiGroupsIdsData, isApiGroupsIdsDataLoading]);

    useEffect(() => {
        if (apiPlansEnabled) {
            if (!isApiPlansDataLoading && apiApiPlanIdsData) {
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
    const { data: secretHashMetaData, error } = useQuery({
        type: 'getSecretHashMetadata',
        resource: 'applications',
        payload: {},
    });
    useEffect(() => {
        if (secretHashMetaData && secretHashMetaData.value) {
            const isPlainTextAllowed = get(
                JSON.parse(secretHashMetaData.value),
                'plaintextAllowed'
            );
            setSecretHashing('HASHED');
            setAllowSelectHashing(isPlainTextAllowed);
        } else {
            setAllowSelectHashing(false);
        }
    }, [secretHashMetaData, error]);

    // get api keys data
    const [
        fetchApiKeys,
        { data: apiKeysData, loading: apiKeysLoading },
    ] = useMutation({
        payload: {
            applicationUuid: record.id,
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'createTs', order: 'DESC' },
        },
        resource: 'apiKeys',
        type: 'getList',
    });

    useEffect(() => {
        setApiKeys(sortBy(apiKeysData, ({ defaultKey }) => !defaultKey));
    }, [apiKeysData]);

    useEffect(() => {
        if (apiPlanFeatureFlagLoaded) {
            fetchApis();
            fetchApiGroups();
            fetchApiApiPlans();
            fetchApiKeys();
        }
    }, [
        apiPlanFeatureFlagLoaded,
        fetchApis,
        fetchApiGroups,
        fetchApiApiPlans,
        fetchApiKeys,
    ]);

    const customFieldsMap = {};
    const appCustomFields = record.customFieldValues || [];
    appCustomFields.forEach(item => {
        customFieldsMap[item.customFieldUuid] = item.value;
    });

    const initialValues = {
        id: record.id,
        applicationName: record.name,
        description: record.description,
        organizationName: record.organizationName,
        oAuthCallbackUrl: record.OauthCallbackUrl || '',
        oAuthType: record.OauthType?.toLowerCase() || 'PUBLIC',
        sharedSecret: null,
        selected: record.ApiIds?.results,
        customFields: record.customFieldValues || [],
        apiKey: record.apiKey,
        apiKeys: apiKeys,
        status: record.status,
        // using statusBoolValue to hold boolean
        // value of status when the status is either ENABLED or DISABLED
        statusBoolValue: record.status === 'ENABLED' ? true : false,
        ...customFieldsMap,
    };

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
            };
        }
        if (apiKey === NEW_KEY) {
            if (keyData.authMethod === 'NONE') {
                addApiKey(record.id, {
                    ...keyData,
                    authProviderUuid: apiKeyObject.authProviderUuid,
                    apiKey: apiKeyObject.userProvidedApiKey,
                    defaultKey: form.apiKeys.length === 1,
                });
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
                update(
                    {
                        payload: {
                            id: apiKeyObject.applicationUuid,
                            keyId: apiKeyObject.apiKey,
                            data: keyData,
                            options: {
                                type: 'api-keys',
                            },
                        },
                    },
                    {
                        action: CRUD_UPDATE,
                        onSuccess: handleFormSaveSuccess,
                        onFailure: handleFormSaveFailure,
                    }
                );
            }
        }
    };

    // add key
    const addApiKey = async (appUuid, data) => {
        const { keySecretHashed } = data;
        await dataProvider.create(
            'apiKeys',
            {
                data,
                appUuid,
            },
            {
                onFailure: error => {
                    let errorMessage = getErrorMessageFromError(error);
                    notify(
                        `${translate(
                            'resources.applications.notifications.edit_error'
                        )}, ${errorMessage}`,
                        NOTIFICATION_TYPE_ERROR
                    );
                    reloadForm();
                },
                onSuccess: ({ data }) => {
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

    // save details
    const onDetailsSubmit = form => {
        const promises = [];
        if (!isEditAppDetailsLocked && isDetailsModified) {
            promises.push(
                new Promise((resolve, reject) => {
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
                        {
                            payload: {
                                id: form.id,
                                data: {
                                    name: form.applicationName,
                                    uuid: form.id,
                                    description: form.description,
                                    organizationUuid: record.organizationUuid,
                                    organizationName: form.organizationName,
                                    status: appStatus,
                                },
                                options: {
                                    type: 'details',
                                },
                            },
                        },
                        {
                            action: CRUD_UPDATE,
                            onSuccess: resolve,
                            onFailure: reject,
                        }
                    );
                })
            );
        }
        if (!isEditCustomFieldsLocked && isCustomFieldModified) {
            const customFieldsArr = form.CustomFieldsArr || [];
            const CustomFieldValues = customFieldsArr.map(item => {
                return {
                    customFieldUuid: item,
                    value: form[item] ? form[item] : '',
                };
            });
            promises.push(
                new Promise((resolve, reject) => {
                    update(
                        {
                            payload: {
                                id: form.id,
                                data: CustomFieldValues,
                                options: {
                                    type: 'custom-fields',
                                },
                            },
                        },
                        {
                            action: CRUD_UPDATE,
                            onSuccess: resolve,
                            onFailure: reject,
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
    const onApisSubmit = form => {
        const promises = [];
        if (apiPlansEnabled) {
            const apiApiPlanIds = form.ApiApiPlanIds || [];
            const apiApiPlans = apiApiPlanIds.map(item => ({
                uuid: item.ApiUuid,
                apiPlanUuid: item.ApiPlanUuid,
            }));
            if (!isEditApiPlansLocked) {
                promises.push(
                    new Promise((resolve, reject) => {
                        update(
                            {
                                payload: {
                                    id: form.id,
                                    data: apiApiPlans,
                                    options: {
                                        type: 'api-plans',
                                    },
                                },
                            },
                            {
                                action: CRUD_UPDATE,
                                onSuccess: resolve,
                                onFailure: reject,
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
                    new Promise((resolve, reject) => {
                        update(
                            {
                                payload: {
                                    id: form.id,
                                    data: apiGroups,
                                    options: {
                                        type: 'api-groups',
                                    },
                                },
                            },
                            {
                                action: CRUD_UPDATE,
                                onSuccess: resolve,
                                onFailure: reject,
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
                    new Promise((resolve, reject) => {
                        update(
                            {
                                payload: {
                                    id: form.id,
                                    data: apis,
                                    options: {
                                        type: 'apis',
                                    },
                                },
                            },
                            {
                                action: CRUD_UPDATE,
                                onSuccess: resolve,
                                onFailure: reject,
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
        refresh();
        setApiSelectorDataLoaded(false);
        setApiKeys([]);
        fetchApiKeys();
        if (apiPlansEnabled) {
            fetchApiApiPlans();
        } else {
            fetchApis();
            fetchApiGroups();
        }
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
    const [addingKeyEntry, setAddingKeyEntry] = React.useState(false);

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
                .map(item => `${get(item, 'error')}${get(item, 'field')}.`)
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
                errorMessages.join(','),
            NOTIFICATION_TYPE_ERROR
        );
    };

    const handleFormSaveFailure = error => {
        let errorMessage = getErrorMessageFromError(error);
        notify(
            translate('resources.applications.notifications.edit_error') +
                errorMessage,
            NOTIFICATION_TYPE_ERROR
        );
    };

    const onPublish = () => {
        update(
            {
                payload: {
                    id: record.id,
                    options: {
                        type: 'publish',
                    },
                },
            },
            {
                action: CRUD_UPDATE,
                onSuccess: handleFormPublishSuccess,
                onFailure: handleFormSaveFailure,
            }
        );
    };

    const navigateToShowView = () => {
        history.push(`/applications/${record.id}/show`);
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
            form.setConfig('keepDirtyOnReinitialize', false);
            form.reset();
            form.setConfig('keepDirtyOnReinitialize', true);
            reloadForm();
            setActivePanelID(selectedPanelID);
        }
    };

    const subscription = {
        values: true,
    };

    const convertFileToBase64 = file =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file.rawFile);
        });

    const onChange = async ({ values }) => {
        let sectionModified = false;
        if (activePanelID === PANEL_ID_DETAILS) {
            let detailsModified = false;
            const {
                applicationName,
                description,
                statusBoolValue,
                CustomFieldsArr = [],
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
            CustomFieldsArr.forEach(item => {
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
                            sectionModified = !!get(valuesKeyObj, 'name');
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
                        initialKeyObj.status !== get(valuesKeyObj, 'status')
                    ) {
                        sectionModified = true;
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

    const disableSaveButton = !isSectionModified;
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
                    isPlainTextKey={addedKey.keySecretHashed}
                />
            </Dialog>
            <Grid container item md={12} sm={12}>
                <SimpleForm
                    className={classes.form}
                    save={onFormSubmit}
                    initialValues={initialValues}
                    toolbar={
                        <ApplicationToolbar
                            type="EDIT"
                            buttonLabel="resources.applications.actions.save"
                            showPublishBtn={showPublishBtn}
                            disableSaveButton={disableSaveButton}
                            disablePublishButton={disablePublishButton}
                            onPublish={onPublish}
                            onCancel={onCancel}
                            {...toolbarProps}
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
                        <Labeled
                            // On <Labeled />, this will translate in a correct `for` attribute on the label
                            id="applicationName"
                            label="resources.applications.fields.details"
                            classes={labelClasses}
                            className={classes.field}
                        ></Labeled>
                        <TextInput
                            data-apim-test="applicationName"
                            disabled={isEditAppDetailsLocked}
                            source="applicationName"
                            type="text"
                            label="resources.applications.fields.name"
                            variant="filled"
                            fullWidth
                            helperText="resources.applications.validation.application_name_caption"
                            validate={[required(), minLength(2), maxLength(50)]}
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
                                type="EDIT"
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
                            apiKeysLoading={apiKeysLoading}
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
                        />
                    </Grid>
                    <FormSpy subscription={subscription} onChange={onChange}>
                        {() => <span />}
                    </FormSpy>
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
