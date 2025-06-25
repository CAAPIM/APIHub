// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import Button from '@mui/material/Button';
import {
    EditButton,
    TopToolbar,
    useDataProvider,
    useDelete,
    useGetRecordId,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import get from 'lodash/get';
import { Show } from '../ui';
import { ApplicationDetails } from './ApplicationDetails';
import { ApplicationTitle } from './ApplicationTitle';
import { isEditApplicationDisabled } from './isApplicationPending';
import { useUserContext } from '../userContexts';
import { useLayer7Notify } from '../useLayer7Notify';
import { ConfirmDialog } from '../ui';
import { LoadingDialog } from '../ui/LoadingDialog';
import { useWorkFlowConfigurations } from './useWorkFlowConfigurations';
import { isPortalAdmin, isOrgBoundUser } from '../userContexts';

const useContentStyles = makeStyles()(theme => ({
    contained: {
        height: 30,
        marginRight: 20,
    },
    label: {
        color: theme.palette.primary.main,
    },
}));

const AppShowActions = ({ userContext }) => {
    const [canEdit, setCanEdit] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const translate = useTranslate();
    const notify = useLayer7Notify();
    const { classes: contentLabelClasses } = useContentStyles();
    const navigate = useNavigate();
    const dataProvider = useDataProvider();
    const [deleting, setDeleting] = useState(false);
    const [proxyCheckFailed, setProxyCheckFailed] = useState(false);
    const workFlowConfigurations = useWorkFlowConfigurations();
    const record = useRecordContext();
    const id = useGetRecordId();
    const [deleteOne] = useDelete();

    useEffect(() => {
        if (record && !isEditApplicationDisabled(userContext, record)) {
            setCanEdit(true);
        } else {
            if (canEdit) setCanEdit(false);
        }
    }, [canEdit, record, userContext]);

    useEffect(() => {
        if (record && userContext) {
            if (
                record.status !== 'APPLICATION_PENDING_APPROVAL' &&
                record.status !== 'EDIT_APPLICATION_PENDING_APPROVAL' &&
                record.status !== 'DELETE_APPLICATION_PENDING_APPROVAL' &&
                !userContext.userDetails.developer
            ) {
                setCanDelete(true);
            } else {
                if (canDelete) setCanDelete(false);
            }
        }
    }, [canDelete, record, userContext]);
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
        navigate('/applications');
    };
    const deleteApplication = async (ignoreProxyCheck, forceDelete) => {
        await deleteOne(
            'applications',
            {
                id,
                meta: {
                    ...(ignoreProxyCheck && { ignoreKeyStoreCheck: true }),
                    ...(forceDelete && { forceDelete: true }),
                },
            },
            {
                returnPromise: true,
                onError: error => {
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
                            id: record.id,
                        });
                    }
                },
                onSuccess: () => {
                    notifyAndNavigate();
                },
            }
        );
    };

    const confirmDelete = () => {
        setDeleteConfirm(true);
    };

    if (!canEdit && !canDelete) {
        return null;
    }

    let deleteConfirmContent;
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
            isPortalAdmin(userContext) && record.status === 'DELETE_FAILED';
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
        isPortalAdmin(userContext) && record.status === 'DELETE_FAILED'
            ? translate('resources.applications.actions.force_delete')
            : translate('resources.applications.actions.delete');

    return (
        <TopToolbar>
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
                {canEdit && <EditButton icon={<span />} variant="contained" />}
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

export const ApplicationShow = () => {
    const { classes } = useStyles();
    const { root: rootClassName } = classes;
    const [userContext] = useUserContext();

    return (
        <Show
            className={rootClassName}
            classes={classes}
            title={<ApplicationTitle />}
            actions={<AppShowActions userContext={userContext} />}
        >
            <ApplicationDetails />
        </Show>
    );
};

const useStyles = makeStyles({ name: 'Layer7ApplicationShow' })(() => ({
    root: {},
}));
