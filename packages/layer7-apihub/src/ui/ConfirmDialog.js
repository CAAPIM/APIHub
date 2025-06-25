// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';

export const ConfirmDialog = ({
    title,
    content,
    buttonConfirm,
    buttonCancel,
    open = false,
    onConfirm = () => {},
    onCancel = () => {},
    ...rest
}) => (
    <Dialog
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
        open={open}
        onClose={onCancel}
        {...rest}
    >
        <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
        <DialogContent dividers>
            <Typography variant="body1">{content}</Typography>
        </DialogContent>
        <DialogActions>
            {buttonCancel && (
                <Button
                    autoFocus
                    onClick={onCancel}
                    variant="outlined"
                    color="secondary"
                >
                    {buttonCancel}
                </Button>
            )}
            <Button onClick={onConfirm} variant="contained">
                {buttonConfirm}
            </Button>
        </DialogActions>
    </Dialog>
);
