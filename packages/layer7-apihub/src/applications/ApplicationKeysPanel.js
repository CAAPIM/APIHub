// Copyright © 2024 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { Fragment, useState } from 'react';
import {
    ArrayInput,
    FormDataConsumer,
    Labeled,
    maxLength,
    RadioButtonGroupInput,
    required,
    SelectInput,
    SimpleFormIterator,
    TextInput,
    TopToolbar,
    useDataProvider,
    useQuery,
} from 'react-admin';
import {
    Button,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@material-ui/core';
import { isPortalAdmin } from '../userContexts';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { LoadingDialog } from '../ui/LoadingDialog';
import { ApplicationKeyClient } from './ApplicationKeyClient';
import { ApplicationKeySecret } from './ApplicationKeySecret';
import CollapsiblePanel from './CollapsiblePanel';
import { useTranslate } from 'ra-core';
import moment from 'moment';
import filter from 'lodash/filter';
import get from 'lodash/get';
import momentTimeZone from 'moment-timezone';
import {
    CERTIFICATE_DISPLAY_FORMAT,
    DEFAULT_PORTAL_AUTH_PROVIDER_UUID,
} from './constants';
import {
    API_KEYS_APPLICATION,
    hasCRUDPermissions,
    PERMISSIONS_CREATE,
    PERMISSIONS_DELETE,
    PERMISSIONS_UPDATE,
} from '../permissionUtils';
import { useForm } from 'react-final-form';

import { useLayer7Notify } from '../useLayer7Notify';
const NEW_KEY = 'NEW_KEY';
const PANEL_ID_KEY_PREFIX = 'PANEL_ID_KEY_PREFIX_';

const APPLICATION_STATUS_DISABLED = 'DISABLED';
const APPLICATION_STATUS_INCOMPLETE = 'INCOMPLETE';
const APPLICATION_STATUS_PENDING_APPROVAL = 'APPLICATION_PENDING_APPROVAL';
const APPLICATION_STATUS_REJECTED = 'REJECTED';
const APPLICATION_STATUS_DELETE_PENDING_APPROVAL =
    'DELETE_APPLICATION_PENDING_APPROVAL';
const APPLICATION_STATUS_DELETE_FAILED = 'DELETE_FAILED';

export const ApplicationKeysPanel = ({
    activePanelID,
    addingKeyEntry,
    allowSelectHashing,
    apiKeysLoading,
    apiKeys,
    appCertificates,
    application,
    authProviders,
    initialValues,
    isEditApiKeysLocked,
    isSectionModified,
    navigateToShowView,
    onPanelClick,
    reloadForm,
    setActivePanelID,
    setAddingKeyEntry,
    setSecretHashing,
    setUpdatedKeyDetails,
    updatedKeyDetails,
    userContext,
}) => {
    const classes = useStyles();
    const labelClasses = useLabelStyles();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const [keyDeleting, setKeyDeleting] = React.useState(false);
    const [deleteKeyConfirm, setDeleteKeyConfirm] = React.useState(false);
    const [proxyCheckFailed, setProxyCheckFailed] = React.useState(false);
    const [deletingKeyId, setDeletingKeyId] = useState();
    const notify = useLayer7Notify();
    const form = useForm();

    const canDeleteKey = hasCRUDPermissions(
        userContext.userDetails,
        [PERMISSIONS_DELETE],
        API_KEYS_APPLICATION
    );
    const canEditKey = hasCRUDPermissions(
        userContext.userDetails,
        [PERMISSIONS_UPDATE],
        API_KEYS_APPLICATION
    );
    const contentLabelClasses = useContentStyles();

    const confirmDelete = keyId => {
        setDeletingKeyId(keyId);
        setDeleteKeyConfirm(true);
    };

    React.useEffect(() => {
        form.change('apiKeys', apiKeys);
        //eslint-disable-next-line
    }, [apiKeys]);

    const deleteApiKey = (ignoreProxyCheck, forceDelete) => {
        dataProvider.delete(
            'apiKeys',
            {
                keyId: deletingKeyId,
                appUuid: initialValues.id,
                params: `ignoreKeyStoreCheck=${ignoreProxyCheck}&forceDelete=${forceDelete}`,
            },
            {
                onFailure: error => {
                    const validationErrors = get(
                        error,
                        'body.error.detail.validationErrors',
                        []
                    );
                    setKeyDeleting(false);
                    if (
                        isPortalAdmin(userContext) &&
                        validationErrors &&
                        validationErrors.length > 0 &&
                        validationErrors[0].field === 'keyStoreCheck'
                    ) {
                        setProxyCheckFailed(true);
                        setDeleteKeyConfirm(true);
                    } else {
                        notify(
                            error ||
                                'resources.applications.notifications.delete_error',
                            'error'
                        );
                    }
                    reloadForm();
                },
                onSuccess: () => {
                    notify(
                        translate(
                            'resources.applications.notifications.delete_key_success'
                        )
                    );
                    setProxyCheckFailed(false);
                    setDeleteKeyConfirm(false);
                    setKeyDeleting(false);
                    navigateToShowView();
                    /* reloadForm(); */
                },
            }
        );
    };

    const onGenerateKey = () => reloadForm();

    const hasAppCertificates = appCertificates && appCertificates.length > 0;

    const getKeyDeleteLabel = status => {
        if (isPortalAdmin(userContext) && status === 'DELETE_FAILED') {
            return translate('resources.apikeys.actions.force_delete');
        }
        return translate('resources.apikeys.actions.delete');
    };

    const isAppIncomplete =
        get(application, 'status') === APPLICATION_STATUS_INCOMPLETE;

    const keysSummaryLabelContent =
        isAppIncomplete &&
        !activePanelID.startsWith(PANEL_ID_KEY_PREFIX) &&
        apiKeys &&
        apiKeys.length === 0 ? (
            <div className={classes.apiKeysHelpText}>
                {translate('resources.applications.status.api_keys_help_text')}
            </div>
        ) : (
            <span />
        );

    const { data: applicationApiKeyExpirySettings } = useQuery({
        type: 'getKeyExpirySettings',
        resource: 'applications',
        payload: {},
    });

    const isKeyEditDisabled = status =>
        isEditApiKeysLocked || status === 'DELETE_FAILED' || !canEditKey;

    const secretTypeChoices = [
        {
            id: 'HASHED',
            name: translate('resources.applications.fields.hashed'),
        },
        {
            id: 'PLAIN',
            name: translate('resources.applications.fields.plain'),
        },
    ];

    const oAuthTypeChoices = [
        {
            id: 'PUBLIC',
            name: translate('resources.applications.fields.public'),
        },
        {
            id: 'CONFIDENTIAL',
            name: translate('resources.applications.fields.confidential'),
        },
    ];

    const authMethodChoices = [
        {
            id: 'NONE',
            name: translate('resources.applications.fields.authMethodNone'),
        },
        {
            id: 'CERTIFICATE',
            name: translate(
                'resources.applications.fields.authMethodCertificate'
            ),
        },
        {
            id: 'SECRET',
            name: translate('resources.applications.fields.authMethodSecret'),
        },
    ];

    const renderKey = ({ getSource, scopedFormData, source }) => {
        const regex = /apiKeys\[(\d+)\]\./;
        const match = getSource('').match(regex);
        const index = parseInt(match[1]);
        if (!getSource('apiKey') && !addingKeyEntry) {
            return <span />;
        }
        const currentItemAPIKey = get(scopedFormData, 'apiKey');
        const keyStatus = updatedKeyDetails
            ? updatedKeyDetails.status
            : get(scopedFormData, 'status');
        const isItemEditDisabled = isKeyEditDisabled(keyStatus);
        const secretExpiryTs = updatedKeyDetails
            ? updatedKeyDetails.secretExpiryTs
            : get(scopedFormData, 'secretExpiryTs');
        let expiryDateText = translate('resources.applications.fields.none');
        let expiryDateSubText = '';
        let expiryDateSubTextClass = '';
        const isKeyExpiryEnabled = get(
            applicationApiKeyExpirySettings,
            'enabled',
            false
        );
        if (isKeyExpiryEnabled && secretExpiryTs) {
            const keyExpiryDate = moment(secretExpiryTs);
            expiryDateText = keyExpiryDate.format(
                'dddd, MMMM Do YYYY, HH:mm:ss'
            );
            const currentTime = moment();
            if (keyStatus === 'EXPIRED') {
                expiryDateSubText = translate(
                    'resources.applications.status.expired'
                );
                expiryDateSubTextClass = classes.expiredKeyStatus;
            } else {
                const days = keyExpiryDate.diff(currentTime, 'days');
                let suffix = translate('resources.applications.fields.days');
                if (days === 1) {
                    suffix = translate('resources.applications.fields.day');
                }
                expiryDateSubText = `${days} ${suffix}`;
            }
        }

        const deleteKeyDisabledStates = [
            APPLICATION_STATUS_DELETE_FAILED,
            APPLICATION_STATUS_DELETE_PENDING_APPROVAL,
            APPLICATION_STATUS_DISABLED,
            APPLICATION_STATUS_PENDING_APPROVAL,
            APPLICATION_STATUS_REJECTED,
        ];
        const disableDeleteKey =
            get(scopedFormData, 'defaultKey') ||
            deleteKeyDisabledStates.includes(get(application, 'status')) ||
            addingKeyEntry;

        const handleKeyPanelClick = (evt, expanded) =>
            onPanelClick(
                expanded,
                `${PANEL_ID_KEY_PREFIX}${currentItemAPIKey || NEW_KEY}`
            );

        const handleDeleteConfirm = () => {
            setDeleteKeyConfirm(false);
            setKeyDeleting(true);
            const apiKeyObj = apiKeys.find(
                item => item.apiKey === deletingKeyId
            );
            const isForceDelete =
                isPortalAdmin(userContext) &&
                get(apiKeyObj, 'status') === 'DELETE_FAILED';
            deleteApiKey(proxyCheckFailed || isForceDelete, isForceDelete);
        };

        const renderDeleteConfirmDialog = () => (
            <ConfirmDialog
                title={translate('resources.apikeys.actions.deleteApiKey')}
                content={translate(
                    `resources.apikeys.${
                        proxyCheckFailed
                            ? 'proxy_check_alert'
                            : 'confirm_delete'
                    }`
                )}
                buttonConfirm={translate('resources.apikeys.actions.delete')}
                buttonCancel={translate('resources.apikeys.actions.cancel')}
                open={deleteKeyConfirm}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteKeyConfirm(false)}
            />
        );

        const AuthMethodOption = ({ record }) => {
            return (
                <div className={classes.authMethodOption}>
                    <div>{record.name}</div>
                    <span className={classes.authMethodHelpText}>
                        {record.description}
                    </span>
                </div>
            );
        };

        const renderCertificate = item => {
            const time = moment(item.expiryTs);
            const dateString = time.format(CERTIFICATE_DISPLAY_FORMAT);
            return (
                <TableRow key={item.uuid}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{dateString}</TableCell>
                </TableRow>
            );
        };

        const renderCertificates = () => {
            const zone = moment.tz(momentTimeZone.tz.guess()).zoneAbbr();
            return (
                <div>
                    <Table>
                        <TableHead className={classes.certificatesHeader}>
                            <TableRow>
                                <TableCell>Certificate</TableCell>
                                <TableCell>
                                    {translate(
                                        'resources.applications.fields.notValidAfter',
                                        { zone }
                                    )}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appCertificates.map(renderCertificate)}
                        </TableBody>
                    </Table>
                </div>
            );
        };

        const isDefaultAuthProviderSelected =
            get(scopedFormData, 'authProviderUuid') ===
            DEFAULT_PORTAL_AUTH_PROVIDER_UUID;

        let defaultAuthProviderOptions = filter(
            authMethodChoices,
            item => item.id !== 'NONE'
        );
        defaultAuthProviderOptions = hasAppCertificates
            ? defaultAuthProviderOptions
            : filter(
                  defaultAuthProviderOptions,
                  item => item.id !== 'CERTIFICATE'
              );

        const handleAuthProviderChange = event => {
            const value = get(event, 'target.value');
            if (value !== DEFAULT_PORTAL_AUTH_PROVIDER_UUID) {
                form.change(`apiKeys[${index}].authMethod`, 'NONE');
            } else {
                form.change(`apiKeys[${index}].authMethod`, 'SECRET');
            }
        };

        const filteredAuthMethodChoices = isDefaultAuthProviderSelected
            ? defaultAuthProviderOptions
            : filter(authMethodChoices, item => item.id === 'NONE');

        return (
            <CollapsiblePanel
                data-apim-test={`key-panel-${currentItemAPIKey}`}
                expanded={
                    activePanelID ===
                    `${PANEL_ID_KEY_PREFIX}${currentItemAPIKey || NEW_KEY}`
                }
                label={
                    get(scopedFormData, 'name') ||
                    translate('resources.apikeys.actions.addKey')
                }
                key={currentItemAPIKey || NEW_KEY}
                onChange={handleKeyPanelClick}
            >
                <TopToolbar>
                    <div>
                        {canDeleteKey && (
                            <Button
                                classes={contentLabelClasses}
                                data-apim-test="delete-key"
                                startIcon={<DeleteIcon />}
                                onClick={() => confirmDelete(currentItemAPIKey)}
                                disabled={disableDeleteKey}
                            >
                                {getKeyDeleteLabel(
                                    get(scopedFormData, 'status')
                                )}
                            </Button>
                        )}
                    </div>
                    {renderDeleteConfirmDialog()}
                    <LoadingDialog
                        title={translate(
                            'resources.apikeys.actions.deleting_title'
                        )}
                        content={translate(
                            'resources.apikeys.deleting_content'
                        )}
                        open={keyDeleting}
                    />
                </TopToolbar>

                <TextInput
                    disabled={isItemEditDisabled}
                    source={getSource('name')}
                    record={scopedFormData}
                    type="text"
                    label="resources.applications.fields.name"
                    variant="filled"
                    multiline
                    fullWidth
                    helperText="resources.applications.validation.apikey_name_caption"
                    validate={[required(), maxLength(255)]}
                    required
                />
                <SelectInput
                    choices={authProviders}
                    defaultValue={DEFAULT_PORTAL_AUTH_PROVIDER_UUID}
                    disabled={currentItemAPIKey}
                    onChange={handleAuthProviderChange}
                    label="resources.applications.fields.authprovider"
                    record={scopedFormData}
                    required
                    source={getSource('authProviderUuid')}
                />
                <SelectInput
                    choices={filteredAuthMethodChoices}
                    defaultValue={'SECRET'}
                    disabled={currentItemAPIKey}
                    label="resources.applications.fields.authentication"
                    record={scopedFormData}
                    required
                    source={getSource('authMethod')}
                />
                {get(scopedFormData, 'authMethod') === 'SECRET' && (
                    <Fragment>
                        <TextInput
                            disabled={isItemEditDisabled}
                            source={getSource('oauthCallbackUrl')}
                            record={scopedFormData}
                            type="text"
                            label="resources.applications.fields.callbackUrl"
                            variant="filled"
                            multiline
                            fullWidth
                            helperText="resources.applications.validation.callback_url_caption"
                            validate={[maxLength(2048)]}
                        />
                        <TextInput
                            disabled={isItemEditDisabled}
                            source={getSource('oauthScope')}
                            record={scopedFormData}
                            type="text"
                            label="resources.applications.fields.scope"
                            variant="filled"
                            multiline
                            fullWidth
                            helperText="resources.applications.validation.scope_caption"
                            validate={[maxLength(4000)]}
                        />
                        <RadioButtonGroupInput
                            source={getSource('oauthType')}
                            defaultValue="PUBLIC"
                            disabled={isItemEditDisabled}
                            record={scopedFormData}
                            label="resources.applications.fields.type"
                            className={classes.radioGroupInput}
                            required
                            choices={oAuthTypeChoices}
                        />
                    </Fragment>
                )}
                {get(scopedFormData, 'authMethod') === 'SECRET' &&
                    isKeyExpiryEnabled &&
                    currentItemAPIKey && (
                        <div className={classes.keyExpiryStatus}>
                            <Labeled
                                label="resources.applications.fields.expiryDate"
                                classes={labelClasses}
                                className={classes.field}
                            >
                                <Typography variant="body2">
                                    {expiryDateText}
                                </Typography>
                            </Labeled>
                            <Typography
                                className={expiryDateSubTextClass}
                                variant="body2"
                            >
                                {expiryDateSubText}
                            </Typography>
                        </div>
                    )}
                {get(scopedFormData, 'authMethod') === 'SECRET' &&
                    !currentItemAPIKey &&
                    allowSelectHashing && (
                        <RadioButtonGroupInput
                            source="secretHashing"
                            onChange={id => setSecretHashing(id)}
                            defaultValue="HASHED"
                            label="resources.applications.fields.secretType"
                            className={classes.radioGroupInput}
                            required
                            choices={secretTypeChoices}
                        />
                    )}
                {currentItemAPIKey && (
                    <ApplicationKeyClient
                        id={currentItemAPIKey}
                        data={scopedFormData}
                        includeSecret={false}
                        labelClasses={labelClasses}
                        isEditMode={true}
                        apiKeys={initialValues.apiKeys}
                    />
                )}
                {get(scopedFormData, 'keySecret') && (
                    <div className={classes.input}>
                        <ApplicationKeySecret
                            source="keySecret"
                            id={currentItemAPIKey}
                            isEditDisabled={isItemEditDisabled}
                            record={scopedFormData}
                            labelClasses={labelClasses}
                            onUpdateKeyDetails={setUpdatedKeyDetails}
                            onGenerateKey={onGenerateKey}
                        />
                    </div>
                )}
                {get(scopedFormData, 'authMethod') === 'CERTIFICATE' &&
                    renderCertificates()}
                {get(scopedFormData, 'authMethod') === 'NONE' &&
                    !currentItemAPIKey && (
                        <TextInput
                            disabled={currentItemAPIKey}
                            source={getSource('userProvidedApiKey')}
                            record={scopedFormData}
                            type="text"
                            label="resources.applications.fields.apiKey"
                            variant="filled"
                            fullWidth
                            helperText="resources.applications.validation.apikey_caption"
                            validate={[required(), maxLength(255)]}
                            required
                        />
                    )}
            </CollapsiblePanel>
        );
    };

    const handleAddKeyBtnClick = () => {
        setAddingKeyEntry(true);
        setActivePanelID(`${PANEL_ID_KEY_PREFIX}${NEW_KEY}`);
    };

    const canAddKey = hasCRUDPermissions(
        userContext.userDetails,
        [PERMISSIONS_CREATE],
        API_KEYS_APPLICATION
    );

    const addKeyDisabledStates = [
        APPLICATION_STATUS_DELETE_FAILED,
        APPLICATION_STATUS_DELETE_PENDING_APPROVAL,
        APPLICATION_STATUS_DISABLED,
        APPLICATION_STATUS_PENDING_APPROVAL,
        APPLICATION_STATUS_REJECTED,
    ];

    const disableAddKeyEntry =
        addingKeyEntry ||
        isSectionModified ||
        addKeyDisabledStates.includes(get(application, 'status'));

    const addButton = () =>
        canAddKey ? (
            <Button
                data-apim-test="add-key"
                disabled={disableAddKeyEntry}
                onClick={handleAddKeyBtnClick}
                classes={contentLabelClasses}
                startIcon={<AddCircleOutlineIcon />}
            >
                {translate('resources.apikeys.actions.addKey')}
            </Button>
        ) : (
            <span />
        );

    const renderKeys = () => (
        <ArrayInput
            className={classes.apiKeysInput}
            fullWidth
            label=""
            source="apiKeys"
        >
            <SimpleFormIterator
                addButton={addButton()}
                fullWidth
                removeButton={<span />}
                getItemLabel={() => ''}
                TransitionProps={{ timeout: 0 }}
            >
                <FormDataConsumer>{renderKey}</FormDataConsumer>
            </SimpleFormIterator>
        </ArrayInput>
    );

    return (
        <div>
            <div>
                <Typography variant="h3" className={classes.subtitle}>
                    {translate('resources.applications.fields.authCredentials')}
                </Typography>
            </div>
            {isEditApiKeysLocked && (
                <p className={classes.apiKeysLockText}>
                    {translate('resources.applications.status.complete_lock')}
                </p>
            )}
            {keysSummaryLabelContent}
            {!apiKeysLoading && renderKeys()}
        </div>
    );
};

const useStyles = makeStyles(
    theme => ({
        addCertificateContainer: {
            marginBottom: 12,
            marginRight: 12,
            marginTop: 12,
            textAlign: 'right',
        },
        apiKeysHelpText: {
            color: theme.palette.primary.textHub,
            fontFamily: theme.typography.body1.fontFamily,
            fontSize: theme.typography.body1.fontSize,
            marginBotton: 16,
            marginTop: 16,
            width: '100%',
        },
        apiKeysInput: {
            width: '100%',
        },
        apiKeysLockText: {
            color: theme.palette.primary.textHub,
            fontFamily: theme.typography.body1.fontFamily,
            fontSize: theme.typography.body1.fontSize,
            width: '100%',
        },
        authMethodHelpText: {
            fontSize: '0.75rem',
            opacity: 0.8,
        },
        authMethodOption: {
            marginBottom: 8,
            marginTop: 8,
        },
        certificateActionBtnContainer: {
            width: 220,
        },
        certificateActionDeleteBtn: {
            color: theme.palette.error.main,
        },
        certificatesHeader: {
            backgroundColor: theme.palette.background.default,
            fontWeight: theme.typography.fontWeightBold,
            textTransform: 'uppercase',
        },
        certSearchField: {
            float: 'left',
            margin: 12,
        },
        expiredKeyStatus: {
            color: '#B30303',
            fontWeight: theme.typography.fontWeightBold,
        },
        field: {
            marginRight: theme.spacing(1),
            width: '100%',
        },
        input: {
            width: '100%',
        },
        keyExpiryStatus: {
            marginBottom: 20,
        },
        radioGroupInput: {
            width: '100%',
            '& .MuiFormControlLabel-root': {
                paddingRight: 16,
            },
        },
        subtitle: {
            color: theme.palette.primary.main || '#333333',
            fontWeight: theme.typography.fontWeightBold,
            fontSize: '21px',
            lineHeight: '22px',
            margin: theme.spacing(1, 0, 1, 0),
        },
    }),
    {
        name: 'ApplicationCertificatesPanel',
    }
);

const useContentStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.primary.main,
    },
}));

const useLabelStyles = makeStyles(theme => ({
    label: {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.5rem',
        width: '100%',
    },
}));
