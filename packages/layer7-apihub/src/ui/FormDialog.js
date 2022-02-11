import React from 'react';
import {
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
   makeStyles,
 } from '@material-ui/core';
import PropTypes from 'prop-types';
import { get } from 'lodash';

const styles = (theme) => ({
  paper: {
    backgroundColor: get(theme, 'color.uiBackground'),
  },
  title: {
    color: get(theme, 'color.bodyText'),
    fontSize: get(theme, 'fontSize.title'),
    fontFamily: get(theme, 'typography.bodyText'),
    fontWeight: 'bold',
  },
  cancelButton: {
    textTransform: 'none',
    color: get(theme, 'color.primaryButtonBackground'),
    backgroundColor: get(theme, 'color.primaryButtonText'),
    borderColor: get(theme, 'color.primaryButtonBackground'),
  },
  saveButton: {
    textTransform: 'none',
    color: get(theme, 'color.primaryButtonText'),
    backgroundColor: get(theme, 'color.primaryButtonBackground'),
    borderColor: get(theme, 'color.primaryButtonBackground'),
  },
});

export const FormDialog = (props) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const {
    children,
    isOpen,
    cancelText,
    submitText,
    title,
    dialogId,
    handleClose,
    onSubmit,
    onCancel,
    submitButtonDisabled,
    isDialogContentText = true,
  } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      id={dialogId}
      classes={{
        paper: classes.paper,
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        className={classes.title}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        {isDialogContentText &&
          <DialogContentText id="alert-dialog-content">
            { children }
          </DialogContentText>
        }
        {!isDialogContentText &&
          <>
            {children}
          </>
        }
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onSubmit}
          variant="contained"
          color="secondary"
          className={classes.saveButton}
          disabled={!!submitButtonDisabled}
          data-apim-test="dialog-submit"
        >
          {submitText}
        </Button>
        <Button
          onClick={onCancel}
          variant="outlined"
          className={classes.cancelButton}
          data-apim-test="dialog-cancel"
        >
          {cancelText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

FormDialog.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  cancelText: PropTypes.string,
  submitText: PropTypes.string,
  title: PropTypes.string,
  dialogId: PropTypes.string,
  handleClose: PropTypes.func,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  submitButtonDisabled: PropTypes.bool,
  isDialogContentText: PropTypes.bool,
};
