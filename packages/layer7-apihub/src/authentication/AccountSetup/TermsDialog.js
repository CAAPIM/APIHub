import React from 'react';
import { useTranslate } from 'react-admin';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';

import { useAuthenticationConfiguration } from '../useAuthenticationConfiguration';

const useStyles = makeStyles(theme => ({
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

const CustomDialogTitle = ({ children, onClose, ...rest }) => {
    const classes = useStyles(rest);
    const translate = useTranslate();

    return (
        <DialogTitle disableTypography className={classes.root} {...rest}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton
                    aria-label={translate(
                        'apihub.account_setup.terms_of_use_dialog.close'
                    )}
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <Close />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

const Terms = ({ content }) => (
    <>
        {content.split('\n').map((section, index) => (
            <Typography key={index} variant="body2" paragraph>
                {section}
            </Typography>
        ))}
    </>
);

export const TermsDialog = ({ open, onClose }) => {
    const translate = useTranslate();
    const { termsOfUse } = useAuthenticationConfiguration();

    return (
        <Dialog
            aria-labelledby={translate(
                'apihub.account_setup.terms_of_use_dialog.title'
            )}
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <CustomDialogTitle onClose={onClose}>
                {translate('apihub.account_setup.terms_of_use_dialog.title')}
            </CustomDialogTitle>
            <DialogContent dividers>
                {termsOfUse === null && <LinearProgress />}
                {termsOfUse && <Terms content={termsOfUse} />}
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={onClose} color="primary">
                    {translate(
                        'apihub.account_setup.terms_of_use_dialog.close'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
