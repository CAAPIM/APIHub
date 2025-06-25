// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState } from 'react';
import { useTranslate } from 'react-admin';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { makeStyles } from 'tss-react/mui';
import { useCopyToClipboard } from '../../ui';
import CollapsiblePanel from '../CollapsiblePanel';

const useOneTimePasswordDialogStyles = makeStyles({
    name: 'Layer7ApplicationOneTimePasswordDialog',
})(theme => ({
    mainContent: {
        display: 'flex',
        flexDirection: 'row',
    },
    leftSection: {
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: theme.spacing(0),
        padding: theme.spacing(1),
        backgroundColor: theme.palette.warning.main,
        color: theme.palette.common.white,
    },
    leftIcon: {
        fontSize: '5rem',
        color: theme.palette.common.white,
    },
    rightSection: {
        flex: '5',
        flexDirection: 'row',
    },
    subHeading: {
        textTransform: 'uppercase',
        fontWeight: theme.typography.fontWeightBold,
    },
    copyHashSection: {
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(1),
        textAlign: 'center',
    },
    metadataCollapse: {
        width: 436,
        '& label': {
            fontFamily: theme.typography.subtitle1.fontFamily,
            fontSize: theme.typography.subtitle1.fontSize,
            color: theme.palette.primary.textHub || '#333333',
            fontWeight: theme.typography.fontWeightBold,
        },
    },
}));

export const OneTimePasswordDialog = ({
    id,
    keySecret,
    apiKey,
    isPlainTextKey,
    clientMetadata,
    handleClose,
    ...props
}) => {
    const [open, setOpen] = useState(true);
    const { classes } = useOneTimePasswordDialogStyles();
    const copyToClipboard = useCopyToClipboard({
        successMessage: 'resources.applications.notifications.copy_success',
        errorMessage: 'resources.applications.notifications.copy_error',
    });
    const translate = useTranslate();
    const handleDialogClose = () => {
        if (open) {
            setOpen(false);
            handleClose();
        }
    };
    return (
        <Dialog
            disableEscapeKeyDown="false"
            open={open}
            onClose={handleDialogClose}
            aria-labelledby="form-dialog-title"
        >
            <div className={classes.mainContent}>
                <div className={classes.leftSection}>
                    <ReportProblemOutlinedIcon className={classes.leftIcon} />
                </div>
                <div className={classes.rightSection}>
                    <DialogTitle id="form-dialog-title">
                        {translate(
                            'resources.applications.notifications.secret_generated_heading'
                        )}
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography
                            variant="subtitle1"
                            component="h2"
                            className={classes.subHeading}
                            gutterBottom
                        >
                            {translate(
                                'resources.applications.notifications.copy_secret_now'
                            )}
                        </Typography>
                        {clientMetadata ? (
                            <Typography variant="body1" gutterBottom>
                                {translate(
                                    'resources.applications.notifications.oauth_client_secret_generated_message'
                                )}
                            </Typography>
                        ) : (
                            !isPlainTextKey && (
                                <Typography variant="body1" gutterBottom>
                                    {translate(
                                        'resources.applications.notifications.secret_generated_message'
                                    )}
                                </Typography>
                            )
                        )}
                        {apiKey && (
                            <div className={classes.copyHashSection}>
                                <Typography variant="subtitle2" gutterBottom>
                                    {translate(
                                        'resources.applications.fields.apiKeyClientID'
                                    )}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {apiKey}
                                </Typography>
                                <Button
                                    onClick={copyToClipboard}
                                    value={apiKey}
                                    align="center"
                                    variant="contained"
                                >
                                    {translate(
                                        'resources.applications.notifications.copy_to_clipboard'
                                    )}
                                </Button>
                            </div>
                        )}
                        <div className={classes.copyHashSection}>
                            <Typography variant="subtitle2" gutterBottom>
                                {translate(
                                    'resources.applications.fields.sharedSecretClientSecret'
                                )}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {keySecret}
                            </Typography>
                            <Button
                                onClick={copyToClipboard}
                                value={keySecret}
                                align="center"
                                variant="contained"
                            >
                                {translate(
                                    'resources.applications.notifications.copy_to_clipboard'
                                )}
                            </Button>
                        </div>
                        {clientMetadata && (
                            <CollapsiblePanel
                                label={
                                    'resources.apikeys.client_metadata_accordion_title'
                                }
                                className={classes.metadataCollapse}
                            >
                                <Typography component="pre">
                                    {JSON.stringify(clientMetadata, null, 2)}
                                </Typography>
                            </CollapsiblePanel>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="secondary">
                            {translate('ra.action.close')}
                        </Button>
                    </DialogActions>
                </div>
            </div>
        </Dialog>
    );
};
