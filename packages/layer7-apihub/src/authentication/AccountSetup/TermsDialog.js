// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useTranslate } from 'react-admin';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DefaultDialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { makeStyles } from 'tss-react/mui';
import { Close } from '@mui/icons-material';

import { useAuthenticationConfiguration } from '../useAuthenticationConfiguration';

export const TermsDialog = ({ open, onClose }) => {
    const translate = useTranslate();
    const { termsOfUse } = useAuthenticationConfiguration();

    return (
        <Dialog
            aria-labelledby="terms_of_use_dialog_title"
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle id="terms_of_use_dialog_title" onClose={onClose}>
                {translate(
                    'apihub.account_setup.terms_of_use.terms_of_use_dialog.title'
                )}
            </DialogTitle>
            <DialogContent dividers>
                {termsOfUse === null && <LinearProgress />}
                {termsOfUse && <TermsField content={termsOfUse} />}
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={onClose}>
                    {translate(
                        'apihub.account_setup.terms_of_use.terms_of_use_dialog.close'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const useTermsTitleStyles = makeStyles({
    name: 'Layer7AccountSetupTermsTitle',
})(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

const DialogTitle = ({ children, onClose, ...rest }) => {
    const { classes } = useTermsTitleStyles(rest);
    const translate = useTranslate();

    return (
        <DefaultDialogTitle
            disableTypography
            className={classes.root}
            {...rest}
        >
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton
                    aria-label={translate(
                        'apihub.account_setup.terms_of_use.terms_of_use_dialog.close'
                    )}
                    className={classes.closeButton}
                    onClick={onClose}
                    size="large"
                >
                    <Close />
                </IconButton>
            ) : null}
        </DefaultDialogTitle>
    );
};

const TermsField = ({ content }) => {
    return (
        <>
            <Typography
                style={{ whiteSpace: 'pre-wrap' }}
                variant="body2"
                paragraph
            >
                {content}
            </Typography>
        </>
    );
};
