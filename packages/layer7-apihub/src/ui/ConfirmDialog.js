import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

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
        <DialogContent dividers>{content}</DialogContent>
        <DialogActions>
            <Button
                autoFocus
                onClick={onCancel}
                variant="outlined"
                color="secondary"
            >
                {buttonConfirm}
            </Button>
            <Button onClick={onConfirm} variant="contained" color="primary">
                {buttonCancel}
            </Button>
        </DialogActions>
    </Dialog>
);
