import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useDataProvider, useTranslate } from 'ra-core';
import { EditButton, TopToolbar } from 'react-admin';
import get from 'lodash/get';
import { Show } from '../ui';
import { ApplicationDetails } from './ApplicationDetails';
import { ApplicationTitle } from './ApplicationTitle';
import { isEditApplicationDisabled } from './isApplicationPending';
import { useUserContext } from '../userContexts';
import { useLayer7Notify } from '../useLayer7Notify';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { LoadingDialog } from '../ui/LoadingDialog';
import { useWorkFlowConfigurations } from './useWorkFlowConfigurations';
import { isPortalAdmin, isOrgBoundUser } from '../userContexts';

const useContentStyles = makeStyles(theme => ({
    contained: {
        height: 30,
        marginRight: 20,
    },
    label: {
        color: theme.palette.primary.main,
    },
}));

const AppShowActions = ({
    basePath,
    data,
    resource,
    userContext,
    className,
}) => {
    const [canEdit, setCanEdit] = React.useState(false);
    const [canDelete, setCanDelete] = React.useState(false);
    const [deleteConfirm, setDeleteConfirm] = React.useState(false);
    const translate = useTranslate();
    const notify = useLayer7Notify();
    const contentLabelClasses = useContentStyles();
    const history = useHistory();
    const dataProvider = useDataProvider();
    const [deleting, setDeleting] = React.useState(false);
    const [proxyCheckFailed, setProxyCheckFailed] = React.useState(false);
    const workFlowConfigurations = useWorkFlowConfigurations();

    React.useEffect(() => {
        if (data && !isEditApplicationDisabled(userContext, data)) {
            setCanEdit(true);
        } else {
            if (canEdit) setCanEdit(false);
        }
    }, [canEdit, data, userContext]);

    React.useEffect(() => {
        if (data && userContext) {
            if (
                data.status !== 'APPLICATION_PENDING_APPROVAL' &&
                data.status !== 'EDIT_APPLICATION_PENDING_APPROVAL' &&
                data.status !== 'DELETE_APPLICATION_PENDING_APPROVAL' &&
                !userContext.userDetails.developer
            ) {
                setCanDelete(true);
            } else {
                if (canDelete) setCanDelete(false);
            }
        }
    }, [canDelete, data, userContext]);
    const notifyAndNavigate = () => {
        setDeleting(false);
        if (
            isOrgBoundUser(userContext) &&
            workFlowConfigurations.deleteApplicationRequestWorkflowStatus ===
                'ENABLED'
        ) {
            notify(
                'resources.applications.notifications.delete_request_success',
                'info'
            );
        } else {
            notify(
                'resources.applications.notifications.delete_success',
                'info'
            );
        }
        history.push('/applications');
    };
    const deleteApplication = (ignoreProxyCheck, forceDelete) => {
        try {
            dataProvider.delete(
                'applications',
                {
                    id: data.id,
                    params: {
                        ...(ignoreProxyCheck && { ignoreKeyStoreCheck: true }),
                        ...(forceDelete && { forceDelete: true }),
                    },
                },
                {
                    onFailure: error => {
                        const validationErrors = get(
                            error,
                            'body.error.detail.validationErrors',
                            []
                        );
                        setDeleting(false);
                        if (
                            isPortalAdmin(userContext) &&
                            validationErrors &&
                            validationErrors.length > 0 &&
                            validationErrors[0].field === 'keyStoreCheck'
                        ) {
                            setProxyCheckFailed(true);
                            notify(validationErrors[0].error, 'error');
                            setDeleteConfirm(true);
                        } else {
                            notify(
                                error ||
                                    'resources.applications.notifications.delete_error',
                                'error'
                            );
                            dataProvider.getOne('applications', {
                                id: data.id,
                            });
                        }
                    },
                    onSuccess: () => {
                        notifyAndNavigate();
                    },
                }
            );
        } catch (err) {}
    };

    const confirmDelete = event => {
        setDeleteConfirm(true);
    };

    if (!canEdit && !canDelete) {
        return null;
    }

    let deleteConfirmContent = '';
    if (proxyCheckFailed) {
        deleteConfirmContent = translate(
            'resources.applications.proxy_check_alert'
        );
    } else {
        deleteConfirmContent = translate(
            'resources.applications.confirm_delete'
        );
    }

    const handleConfirmDelete = () => {
        setDeleteConfirm(false);
        setDeleting(true);
        const checkFlag =
            isPortalAdmin(userContext) && data.status === 'DELETE_FAILED';
        deleteApplication(checkFlag, checkFlag);
    };

    const handleProxyCheckConfirmDelete = () => {
        setDeleteConfirm(false);
        setProxyCheckFailed(false);
        setDeleting(true);
        deleteApplication(true, false);
    };

    const deleteFn = proxyCheckFailed
        ? handleProxyCheckConfirmDelete
        : handleConfirmDelete;

    const deleteLabel =
        isPortalAdmin(userContext) && data.status === 'DELETE_FAILED'
            ? translate('resources.applications.actions.force_delete')
            : translate('resources.applications.actions.delete');

    return (
        <TopToolbar className={className}>
            <div>
                {canDelete && (
                    <Button
                        classes={contentLabelClasses}
                        onClick={confirmDelete}
                        variant="contained"
                    >
                        {deleteLabel}
                    </Button>
                )}
                {canEdit && (
                    <EditButton
                        basePath={basePath}
                        icon={<span />}
                        record={data}
                        variant="contained"
                    />
                )}
            </div>
            <ConfirmDialog
                title={translate(
                    'resources.applications.actions.deleteApplication'
                )}
                content={deleteConfirmContent}
                buttonConfirm={translate(
                    'resources.applications.actions.delete'
                )}
                buttonCancel={translate(
                    'resources.applications.actions.cancel'
                )}
                open={deleteConfirm}
                onConfirm={deleteFn}
                onCancel={() => setDeleteConfirm(false)}
            />
            <LoadingDialog
                title={translate(
                    'resources.applications.actions.deleting_title'
                )}
                content={translate('resources.applications.deleting_content')}
                open={deleting}
            />
        </TopToolbar>
    );
};

export const ApplicationShow = props => {
    const { root: rootClassName, ...classes } = useStyles(props);
    const { permissions, id, ...rest } = props;
    const [userContext] = useUserContext();

    return (
        <Show
            className={rootClassName}
            classes={classes}
            title={<ApplicationTitle />}
            id={id}
            actions={<AppShowActions userContext={userContext} />}
            {...rest}
        >
            <ApplicationDetails />
        </Show>
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {},
    }),
    {
        name: 'Layer7ApplicationShow',
    }
);
