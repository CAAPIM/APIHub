// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useTranslate } from 'react-admin';
import { useFormContext } from 'react-hook-form';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export const UnSavedChangesDialog = props => {
    const { onOk, onCancel, show } = props;
    const translate = useTranslate();
    const form = useFormContext();
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
                <Button onClick={() => onOk(form)} variant="contained">
                    {translate('resources.applications.actions.yes')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
