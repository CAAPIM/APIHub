import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

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
            {buttonCancel &&
              <Button
                  autoFocus
                  onClick={onCancel}
                  variant="outlined"
                  color="secondary"
              >
                  {buttonCancel}
              </Button>
            }
            <Button onClick={onConfirm} variant="contained" color="primary">
                {buttonConfirm}
            </Button>
        </DialogActions>
    </Dialog>
);
