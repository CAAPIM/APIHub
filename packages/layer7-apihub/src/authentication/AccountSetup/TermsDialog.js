import React from 'react';
import { useTranslate } from 'react-admin';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DefaultDialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import isEmpty from 'lodash/isEmpty';

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
                <Button autoFocus onClick={onClose} color="primary">
                    {translate(
                        'apihub.account_setup.terms_of_use.terms_of_use_dialog.close'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const useTermsTitleStyles = makeStyles(
    theme => ({
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
    }),
    {
        name: 'Layer7AccountSetupTermsTitle',
    }
);

const DialogTitle = ({ children, onClose, ...rest }) => {
    const classes = useTermsTitleStyles(rest);
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
            {content.split('\\n').map((section, index) =>
                isEmpty(section) ? (
                    <br />
                ) : (
                    <Typography key={index} variant="body2" paragraph>
                        {section}
                    </Typography>
                )
            )}
        </>
    );
};
