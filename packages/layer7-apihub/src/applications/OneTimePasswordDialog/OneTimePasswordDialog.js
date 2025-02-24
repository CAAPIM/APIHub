import React, { useState } from 'react';
import { useTranslate, linkToRecord } from 'ra-core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { useCopyToClipboard } from '../../ui';
import Link from '@material-ui/core/Link';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import CollapsiblePanel from '../CollapsiblePanel';

const useOneTimePasswordDialogStyles = makeStyles(
    theme => ({
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
    }),
    {
        name: 'Layer7ApplicationOneTimePasswordDialog',
    }
);

export const OneTimePasswordDialog = ({ id, keySecret, apiKey, isPlainTextKey, clientMetadata, handleClose, ...props }) => {
    const [open, setOpen] = useState(true);
    const history = useHistory();
    const classes = useOneTimePasswordDialogStyles();
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
            disableBackdropClick="false"
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
                          ) : !isPlainTextKey &&
                            <Typography variant="body1" gutterBottom>
                                {translate(
                                    'resources.applications.notifications.secret_generated_message'
                                )}
                            </Typography>
                        }
                        {apiKey &&
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
                                    color="primary"
                                >
                                    {translate(
                                        'resources.applications.notifications.copy_to_clipboard'
                                    )}
                                </Button>
                            </div>
                        }
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
                                color="primary"
                            >
                                {translate(
                                    'resources.applications.notifications.copy_to_clipboard'
                                )}
                            </Button>
                        </div>
                    {clientMetadata &&
                      <CollapsiblePanel label={'resources.apikeys.client_metadata_accordion_title'} className={classes.metadataCollapse}>
                         <Typography
                          component="pre">
                              {JSON.stringify(clientMetadata, null, 2)}
                        </Typography>
                      </CollapsiblePanel>
                    }
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
