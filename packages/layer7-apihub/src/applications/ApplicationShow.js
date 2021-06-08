import React from 'react';
import { useHistory } from 'react-router-dom';
import { CRUD_DELETE, useDelete, useTranslate } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import { EditButton, TopToolbar } from 'react-admin';
import { Show } from '../ui';
import { ApplicationDetails } from './ApplicationDetails';
import { ApplicationTitle } from './ApplicationTitle';
import { isEditApplicationDisabled } from './isApplicationPending';
import { useUserContext } from '../userContexts';
import { useLayer7Notify } from '../useLayer7Notify';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { LoadingDialog } from '../ui/LoadingDialog';

const useContentStyles = makeStyles(theme => ({
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
    const [deleting, setDeleting] = React.useState(false);

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
                data.status !== 'EDIT_APPLICATION_PENDING_APPROVAL' &&
                !userContext.userDetails.developer
            ) {
                setCanDelete(true);
            } else {
                if (canDelete) setCanDelete(false);
            }
        }
    }, [canDelete, data, userContext]);

    const [deleteApplication] = useDelete('applications', data?.id, data, {
        action: CRUD_DELETE,
        onSuccess: () => {
            notify(
                'resources.applications.notifications.delete_success',
                'info',
                {
                    smart_count: 1,
                }
            );
            setDeleting(false);
            history.push('/applications');
        },
        onFailure: error => {
            setDeleting(false);
            notify(
                error || 'resources.applications.notifications.delete_error',
                'error'
            );
        },
    });

    const confirmDelete = event => {
        setDeleteConfirm(true);
    };

    if (!canEdit && !canDelete) {
        return null;
    }

    return (
        <TopToolbar className={className}>
            <div>
                {canDelete && (
                    <Button
                        classes={contentLabelClasses}
                        startIcon={<DeleteIcon />}
                        onClick={confirmDelete}
                    >
                        {translate('resources.applications.actions.delete')}
                    </Button>
                )}
                {canEdit && <EditButton basePath={basePath} record={data} />}
            </div>
            <ConfirmDialog
                title={translate(
                    'resources.applications.actions.deleteApplication'
                )}
                content={translate('resources.applications.confirm_delete')}
                buttonConfirm={translate(
                    'resources.applications.actions.delete'
                )}
                buttonCancel={translate(
                    'resources.applications.actions.cancel'
                )}
                open={deleteConfirm}
                onConfirm={() => {
                    setDeleteConfirm(false);
                    setDeleting(true);
                    deleteApplication();
                }}
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
