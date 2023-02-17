import React from 'react';
import { useTranslate } from 'ra-core';
import { useForm } from 'react-final-form';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export const UnSavedChangesDialog = props => {
    const { onOk, onCancel, show } = props;
    const translate = useTranslate();
    const form = useForm();
    return (
        <Dialog open={show}>
            <DialogTitle>
                {translate(
                    'resources.applications.notifications.unsaved_changes'
                )}
            </DialogTitle>
            <DialogContent>
                {translate(
                    'resources.applications.notifications.unsaved_changes_content'
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    autoFocus
                    color="secondary"
                    onClick={onCancel}
                    variant="contained"
                >
                    {translate('resources.applications.actions.no')}
                </Button>
                <Button
                    color="primary"
                    onClick={() => onOk(form)}
                    variant="contained"
                >
                    {translate('resources.applications.actions.yes')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
