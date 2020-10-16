import React from 'react';
import { useHistory } from 'react-router-dom';
import {
    CRUD_DELETE,
    linkToRecord,
    useDelete,
    useRefresh,
    useTranslate,
} from 'ra-core';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { useLayer7Notify } from '../useLayer7Notify';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { isEditApplicationDisabled } from './isApplicationPending';
import { useUserContext } from '../userContexts';

export const ApplicationActions = ({ record, card, list }) => {
    const history = useHistory();
    const translate = useTranslate();
    const notify = useLayer7Notify();
    const refresh = useRefresh();
    const [userContext] = useUserContext();
    const [deleteConfirm, setDeleteConfirm] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [canDelete, setCanDelete] = React.useState(false);
    const [canEdit, setCanEdit] = React.useState(false);

    React.useEffect(() => {
        if (record && userContext) {
            if (
                record.status !== 'EDIT_APPLICATION_PENDING_APPROVAL' &&
                !userContext.userDetails.developer
            ) {
                setCanDelete(true);
            }
            if (!isEditApplicationDisabled(userContext, record)) {
                setCanEdit(true);
            }
        }
    }, [record, userContext]);

    const [deleteApplication] = useDelete('applications', record.id, record, {
        action: CRUD_DELETE,
        onSuccess: () => {
            notify(
                'resources.applications.notifications.delete_success',
                'info',
                {
                    smart_count: 1,
                }
            );
            refresh();
        },
        onFailure: error => {
            notify(
                error || 'resources.applications.notifications.delete_error',
                'error'
            );
        },
    });

    const handleClick = event => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = event => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const editApplication = event => {
        event.stopPropagation();
        setAnchorEl(null);
        history.push(linkToRecord('/applications', record.id, 'edit'));
    };

    const confirmDelete = event => {
        event.stopPropagation();
        setAnchorEl(null);
        setDeleteConfirm(true);
    };

    if (!record) {
        return null;
    }

    return (
        <>
            {(canEdit || canDelete) && (
                <IconButton aria-label="actions" onClick={handleClick}>
                    {list && (
                        <>
                            <MenuIcon />
                            <ArrowDropDownIcon />
                        </>
                    )}
                    {!list && (
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ArrowDropDownIcon />}
                        >
                            {translate('resources.applications.fields.actions')}
                        </Button>
                    )}
                </IconButton>
            )}
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {canEdit && (
                    <MenuItem onClick={editApplication}>
                        <ListItemIcon>
                            <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary={translate(
                                'resources.applications.actions.edit'
                            )}
                        />
                    </MenuItem>
                )}
                {canDelete && (
                    <MenuItem onClick={confirmDelete}>
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary={translate(
                                'resources.applications.actions.delete'
                            )}
                        />
                    </MenuItem>
                )}
            </Menu>
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
                    deleteApplication();
                    setDeleteConfirm(false);
                }}
                onCancel={() => setDeleteConfirm(false)}
            />
        </>
    );
};
