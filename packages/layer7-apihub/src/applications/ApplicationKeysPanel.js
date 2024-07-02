import React, { Fragment, useState } from 'react';
import {
    ArrayInput,
    FormDataConsumer,
    Labeled,
    maxLength,
    RadioButtonGroupInput,
    required,
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
import { isPortalAdmin, isOrgBoundUser } from '../userContexts';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { LoadingDialog } from '../ui/LoadingDialog';
import { ApplicationKeyClient } from './ApplicationKeyClient';
import { ApplicationKeySecret } from './ApplicationKeySecret';
import CollapsiblePanel from './CollapsiblePanel';
import { useTranslate } from 'ra-core';
import moment from 'moment';
import get from 'lodash/get';
import momentTimeZone from 'moment-timezone';
import { CERTIFICATE_DISPLAY_FORMAT } from './constants';

import { useLayer7Notify } from '../useLayer7Notify';
const NEW_KEY = 'NEW_KEY';
const PANEL_ID_KEY_PREFIX = 'PANEL_ID_KEY_PREFIX_';
const APPLICATION_STATUS_INCOMPLETE = 'INCOMPLETE';

export const ApplicationKeysPanel = ({
    activePanelID,
    addingKeyEntry,
    allowSelectHashing,
    apiKeysLoading,
    apiKeys,
    appCertificates,
    application,
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

    const canDeleteAPIKey = !isOrgBoundUser(userContext);
    const contentLabelClasses = useContentStyles();

    const confirmDelete = keyId => {
        setDeletingKeyId(keyId);
        setDeleteKeyConfirm(true);
    };

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

    const getKeyLabel = status => {
        if (isPortalAdmin(userContext) && status === 'DELETE_FAILED') {
            return translate('resources.apikeys.actions.force_delete');
        }
        return translate('resources.apikeys.actions.delete');
    };

    const isAppIncomplete =
        application.status === APPLICATION_STATUS_INCOMPLETE;

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
        isEditApiKeysLocked || status === 'DELETE_FAILED';

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
            description: 'Created on save',
            id: 'SECRET',
            name: translate('resources.applications.fields.authMethodSecret'),
        },
        {
            description:
                'At least one valid client certificate added to the application is required.',
            id: 'CERTIFICATE',
            name: translate(
                'resources.applications.fields.authMethodCertificate'
            ),
        },
    ];

    const renderKey = ({ getSource, scopedFormData }) => {
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

        const disableDeleteKey =
            get(scopedFormData, 'defaultKey') ||
            !canDeleteAPIKey ||
            addingKeyEntry ||
            (apiKeys && apiKeys.length === 1);

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
                apiKeyObj.status === 'DELETE_FAILED';
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
                        <Button
                            classes={contentLabelClasses}
                            startIcon={<DeleteIcon />}
                            onClick={() => confirmDelete(currentItemAPIKey)}
                            disabled={disableDeleteKey}
                        >
                            {getKeyLabel(get(scopedFormData, 'status'))}
                        </Button>
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
                <RadioButtonGroupInput
                    choices={authMethodChoices}
                    className={classes.radioGroupInput}
                    defaultValue="SECRET"
                    disabled={!hasAppCertificates || currentItemAPIKey}
                    label="resources.applications.fields.authentication"
                    optionText={<AuthMethodOption />}
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
            </CollapsiblePanel>
        );
    };

    const disableAddKeyEntry =
        addingKeyEntry ||
        isSectionModified ||
        (isAppIncomplete && apiKeys && apiKeys.length === 1);

    const handleAddKeyBtnClick = () => {
        setAddingKeyEntry(true);
        setActivePanelID(`${PANEL_ID_KEY_PREFIX}${NEW_KEY}`);
    };

    const addButton = () =>
        isOrgBoundUser(userContext) && apiKeys && apiKeys.length > 0 ? (
            <span />
        ) : (
            <Button
                data-apim-test="add-key"
                disabled={disableAddKeyEntry}
                onClick={handleAddKeyBtnClick}
                classes={contentLabelClasses}
                startIcon={<AddCircleOutlineIcon />}
            >
                {translate('resources.apikeys.actions.addKey')}
            </Button>
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
