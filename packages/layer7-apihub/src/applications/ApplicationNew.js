// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    SimpleForm,
    TextInput,
    required,
    minLength,
    maxLength,
    useCreate,
    useTranslate,
    useLoading,
    useCreatePath,
} from 'react-admin';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import { makeStyles } from 'tss-react/mui';
import Grid from '@mui/material/Grid';
import { getUserOrganizations, isOrgBoundUser } from '../userContexts';
import { ApplicationToolbar } from './ApplicationToolbar';
import CollapsiblePanel from './CollapsiblePanel';
import { OrganizationSelectInput } from './formFields';
import { useLayer7Notify } from '../useLayer7Notify';
import useApplicationUniqueCheck from './useApplicationUniqueCheck';
import { UnSavedChangesDialog } from './UnSavedChangesDialog';

export const ApplicationNew = ({ userContext }) => {
    const { classes } = useStyles();
    const { classes: labelClasses } = useLabelStyles();
    const navigate = useNavigate();
    const { hasAccessibleOrgs, activeOrg } = getUserOrganizations(userContext);
    const [showOrgList, setShowOrgList] = useState(false);
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [create] = useCreate();
    const notify = useLayer7Notify();
    const translate = useTranslate();
    const loading = useLoading();
    const createPath = useCreatePath();

    const initialValues = {
        name: '',
        description: '',
        organizationName: activeOrg?.name || '',
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
        const { name, description } = form;

        const payload = {
            name: name,
            description: description,
            organizationUuid: selectedOrganization,
            status: 'INCOMPLETE',
        };

        create(
            'applications',
            { data: payload },
            {
                onSuccess: data => {
                    notify(
                        'resources.applications.notifications.create_success'
                    );
                    navigate(
                        createPath({
                            resource: 'applications',
                            id: data.id,
                            type: 'edit',
                        })
                    );
                },
                onError: error => {
                    notify(
                        error ||
                            'resources.applications.notifications.create_error',
                        'error'
                    );
                },
            }
        );
    };

    const [appName, setAppName] = useState('');
    const isNameUnique = useApplicationUniqueCheck(
        appName,
        selectedOrganization
    );
    const [appDescription, setAppDescription] = useState('');

    const updateAppNameWithDebounce = debounce(name => {
        setAppName(name);
    }, 1000);

    const onNameChange = evt => {
        const name = get(evt, 'target.value');
        updateAppNameWithDebounce(name);
    };

    const onDescriptionChange = evt => {
        const description = get(evt, 'target.value');
        setAppDescription(description);
    };

    const handleUnsavedChangesDialogYes = () => {
        setShowSaveDialog(false);
        navigate('/applications');
    };

    const handleUnsavedChangesDialogCancel = () => {
        setShowSaveDialog(false);
    };

    const handleCancel = () => {
        if (
            appName ||
            appDescription ||
            (!isOrgBoundUser(userContext) && selectedOrganization)
        ) {
            setShowSaveDialog(true);
        } else {
            navigate('/applications');
        }
    };

    const validateAppCreation = () => {
        if (!isUndefined(isNameUnique) && !isNameUnique) {
            return {
                name: translate(
                    'resources.applications.validation.error_application_name_not_unique'
                ),
            };
        }
        if (!selectedOrganization) {
            return {
                organizationName: translate('organization is required'),
            };
        }
        return {};
    };

    return (
        <Grid className={classes.root} container spacing={3}>
            <Dialog open={loading} aria-labelledby="form-dialog-title">
                <DialogContent>
                    <CircularProgress />
                </DialogContent>
            </Dialog>
            <Grid container item md={12} sm={12}>
                <SimpleForm
                    sanitizeEmptyValues={true}
                    className={classes.form}
                    onSubmit={onSubmit}
                    mode="onBlur"
                    reValidateMode="onBlur"
                    defaultValues={initialValues}
                    toolbar={<ApplicationToolbar onCancel={handleCancel} />}
                    validate={validateAppCreation}
                >
                    <CollapsiblePanel
                        expanded
                        label={'resources.applications.fields.overview'}
                    >
                        <span
                            id={'applicationName'}
                            className={classes.field}
                            classes={labelClasses}
                        >
                            {translate('resources.applications.fields.details')}
                        </span>
                        <TextInput
                            data-apim-test="applicationName"
                            onChange={onNameChange}
                            source="name"
                            type="text"
                            label="resources.applications.fields.name"
                            variant="filled"
                            fullWidth
                            helperText="resources.applications.validation.application_name_caption"
                            validate={[
                                required(),
                                minLength(2),
                                maxLength(50),
                                validateAppCreation,
                            ]}
                        />
                        {showOrgList && (
                            <OrganizationSelectInput
                                onChange={setSelectedOrganization}
                                source="organizationName"
                            />
                        )}
                        <TextInput
                            onChange={onDescriptionChange}
                            source="description"
                            type="text"
                            label="resources.applications.fields.description"
                            variant="filled"
                            multiline
                            fullWidth
                        />
                    </CollapsiblePanel>
                    <CollapsiblePanel
                        disabled
                        label={'resources.applications.fields.apis'}
                        labelComponent={
                            <p>
                                {translate(
                                    'resources.applications.status.create_apis_help_text'
                                )}
                            </p>
                        }
                    />
                    <CollapsiblePanel
                        disabled
                        label={'resources.applications.fields.certificates'}
                        labelComponent={
                            <p>
                                {translate(
                                    'resources.applications.status.add_certificates_help_text'
                                )}
                            </p>
                        }
                    />
                    <CollapsiblePanel
                        disabled
                        label={'resources.applications.fields.authCredentials'}
                        labelComponent={
                            <p>
                                {translate(
                                    'resources.applications.status.create_api_keys_help_text'
                                )}
                            </p>
                        }
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
}));

const useLabelStyles = makeStyles()(theme => ({
    label: {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.5rem',
    },
}));
