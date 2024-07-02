import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    SimpleForm,
    TextInput,
    required,
    minLength,
    maxLength,
    Labeled,
    useCreate,
    CRUD_CREATE,
} from 'react-admin';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import { useTranslate, linkToRecord, useLoading } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { getUserOrganizations, isOrgBoundUser } from '../userContexts';
import { ApplicationToolbar } from './ApplicationToolbar';
import CollapsiblePanel from './CollapsiblePanel';
import { OrganizationSelectInput } from './formFields';
import { useLayer7Notify } from '../useLayer7Notify';
import useApplicationUniqueCheck from './useApplicationUniqueCheck';
import { UnSavedChangesDialog } from './UnSavedChangesDialog';

export const ApplicationNew = ({ userContext, toolbarProps }) => {
    const classes = useStyles();
    const labelClasses = useLabelStyles();
    const history = useHistory();
    const { hasAccessibleOrgs, activeOrg } = getUserOrganizations(userContext);
    const [showOrgList, setShowOrgList] = useState(false);
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [create, { error }] = useCreate('applications');
    const notify = useLayer7Notify();
    const translate = useTranslate();
    const loading = useLoading();
    const [showSaveDialog, setShowSaveDialog] = useState(false);

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

        let payload = {
            name: name,
            description: description,
            organizationUuid: selectedOrganization,
            status: 'INCOMPLETE',
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
                    history.push(
                        linkToRecord('/applications', data.id, 'edit')
                    );
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
        history.push('/applications');
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
            history.push('/applications');
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
                    className={classes.form}
                    save={onSubmit}
                    initialValues={initialValues}
                    toolbar={<ApplicationToolbar onCancel={handleCancel} {...toolbarProps} />}
                    validate={validateAppCreation}
                >
                    <CollapsiblePanel
                        expanded
                        label={'resources.applications.fields.overview'}
                    >
                        <Labeled
                            // On <Labeled />, this will translate in a correct `for` attribute on the label
                            id="applicationName"
                            label="resources.applications.fields.details"
                            classes={labelClasses}
                            className={classes.field}
                        ></Labeled>
                        <TextInput
                            data-apim-test="applicationName"
                            onChange={onNameChange}
                            source="name"
                            type="text"
                            label="resources.applications.fields.name"
                            variant="filled"
                            fullWidth
                            helperText="resources.applications.validation.application_name_caption"
                            validate={[required(), minLength(2), maxLength(50)]}
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
