import React, { useState, useEffect } from 'react';
import { useTranslate } from 'ra-core';
import { Labeled, useQuery, useMutation, useNotify } from 'react-admin';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import IconFileCopy from '@material-ui/icons/FileCopy';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import NativeSelect from '@material-ui/core/NativeSelect';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import { makeStyles } from '@material-ui/core/styles';
import get from 'lodash/get';

import { useCopyToClipboard } from '../ui';

export const ApplicationKeySecret = props => {
    const { id: appUuid, record, isEditDisabled, labelClasses } = props;

    const [open, setOpen] = useState(false);
    const classes = useStyles(props);
    const copyToClipboard = useCopyToClipboard({
        successMessage: 'resources.applications.notifications.copy_success',
        errorMessage: 'resources.applications.notifications.copy_error',
    });
    const translate = useTranslate();
    const notify = useNotify();

    const [keySecret, setKeySecret] = useState(record.keySecret);
    const [isPlainTextSelected, setIsPlainTextSelected] = useState(true);
    const [isHashedSecretSetting, setIsHashedSecretSetting] = useState(false);
    const [allowSelectHashing, setAllowSelectHashing] = useState(false);
    const [oneTimePassword, setOneTimePassword] = useState(false);

    const handleClick = event => {
        const value = event.target.value;

        if (value === 0) {
            return false;
        }

        if ((!value && isHashedSecretSetting) || value > 1) {
            setIsPlainTextSelected(false);
        } else {
            setIsPlainTextSelected(true);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOneTimePassword(false);
        setOpen(false);
    };

    const handleSecretClearAndClose = () => {
        setKeySecret('***********');
        setOneTimePassword(false);
        setOpen(false);
    };

    const { data, error, loading: isGetSecretHashMetadataLoading } = useQuery({
        type: 'getSecretHashMetadata',
        resource: 'applications',
        payload: {},
    });
    useEffect(() => {
        if (data && data.value) {
            const isPlainTextAllowed = get(
                JSON.parse(data.value),
                'plaintextAllowed'
            );
            setIsHashedSecretSetting(true);
            setAllowSelectHashing(isPlainTextAllowed);
        } else {
            setIsHashedSecretSetting(false);
            setIsPlainTextSelected(true);
            setAllowSelectHashing(false);
        }
    }, [data, error]);

    const [generate] = useMutation(
        {
            type: 'getGenerateNewSharedSecret',
            resource: 'applications',
            payload: {
                isPlainTextSelected: isPlainTextSelected,
                isHashedSecretSetting,
                id: appUuid,
                record,
            },
        },
        {
            onSuccess: ({ data }) => {
                notify(
                    'resources.applications.notifications.secret_generated_heading'
                );
                if (isHashedSecretSetting && !isPlainTextSelected) {
                    setOneTimePassword(true);
                    setKeySecret(data.keySecret);
                } else {
                    setKeySecret(data.keySecret);
                    setOpen(false);
                }
            },
            onFailure: error => {
                setOpen(false);
                const { value } = error.message || {
                    value:
                        'resources.applications.notifications.secret_generated_heading_error',
                };
                notify(value, 'warning');
            },
        }
    );

    if (isGetSecretHashMetadataLoading) {
        return null;
    }
    return (
        <Grid>
            <Grid item>
                <Labeled
                    // on Labeled, this will translate in a correct `for` attribute on the label
                    id="sharedSecretClientSecret"
                    label="resources.applications.fields.sharedSecretClientSecret"
                    classes={labelClasses}
                    className={classes.field}
                >
                    <Typography
                        variant="body2"
                        className={classes.fieldContent}
                    >
                        <span id="sharedSecretClientSecret">{keySecret}</span>
                        {keySecret && !keySecret.includes('****') && (
                            <IconButton
                                className={classes.buttonCopy}
                                color="primary"
                                title={translate(
                                    'resources.applications.notifications.copy_to_clipboard'
                                )}
                                value={keySecret}
                                onClick={copyToClipboard}
                            >
                                <IconFileCopy className={classes.iconCopy} />
                            </IconButton>
                        )}
                    </Typography>
                </Labeled>
            </Grid>
            {!isEditDisabled && (
                <Grid item xs={12}>
                    {!allowSelectHashing && (
                        <Button
                            className={classes.buttonGenerate}
                            color="primary"
                            variant="outlined"
                            onClick={handleClick}
                            aria-label={translate(
                                'resources.applications.actions.generateSecret'
                            )}
                            value={0}
                        >
                            {translate(
                                'resources.applications.actions.generateSecret'
                            )}
                        </Button>
                    )}

                    {isHashedSecretSetting && allowSelectHashing && (
                        <NativeSelect
                            className={classes.selectField}
                            name={translate(
                                'resources.applications.actions.generateSecret'
                            )}
                            onChange={handleClick}
                            label={translate(
                                'resources.applications.actions.generateSecret'
                            )}
                            inputProps={{
                                'aria-label': translate(
                                    'resources.applications.actions.generateSecret'
                                ),
                            }}
                            value={0}
                            variant="outlined"
                            color="primary"
                        >
                            <option value={0}>
                                {translate(
                                    'resources.applications.actions.generateSecret'
                                )}
                            </option>
                            <option value={1}>
                                {translate(
                                    'resources.applications.actions.plainTextSecret'
                                )}
                            </option>
                            <option value={2}>
                                {translate(
                                    'resources.applications.actions.hashedSecret'
                                )}
                            </option>
                            )}
                        </NativeSelect>
                    )}
                    <Dialog
                        disableBackdropClick={oneTimePassword}
                        disableEscapeKeyDown={oneTimePassword}
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="form-dialog-title"
                    >
                        {oneTimePassword ? (
                            <OneTimePasswordDialog
                                handleClose={handleSecretClearAndClose}
                                keySecret={keySecret}
                            />
                        ) : (
                            <ShowGenerateDialog
                                handleClose={handleClose}
                                generate={generate}
                            />
                        )}
                    </Dialog>
                </Grid>
            )}
        </Grid>
    );
};

const useStyles = makeStyles(
    theme => ({
        field: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            marginBottom: theme.spacing(2),
            minWidth: '100px',
        },
        fieldContent: {},
        buttonCopy: {},
        iconCopy: {
            fontSize: '1rem',
            color: theme.palette.colorContrast,
        },
        buttonGenerate: {},
        selectField: {
            border: `1px solid ${theme.palette.primary.main}`,
            color: theme.palette.primary.main,
            borderRadius: 4,
            '&.MuiNativeSelect-select:focus, .MuiNativeSelect-select': {
                borderRadius: 'unset',
                backgroundColor: 'transparent',
            },
            '&.MuiInput-underline:after, .MuiInput-underline:before': {
                borderBottom: 0,
            },
            '&.MuiInput-underline:before': {
                borderBottom: 0,
            },
            '&.MuiInput-underline:hover:not(.Mui-disabled):before': {
                borderBottom: 0,
            },
            padding: theme.spacing(0.5),
            margin: theme.spacing(1),
        },
    }),
    {
        name: 'Layer7ApplicationKeySecret',
    }
);

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
    }),
    {
        name: 'Layer7ApplicationOneTimePasswordDialog',
    }
);

const OneTimePasswordDialog = ({ handleClose, keySecret }) => {
    const classes = useOneTimePasswordDialogStyles();
    const copyToClipboard = useCopyToClipboard({
        successMessage: 'resources.applications.notifications.copy_success',
        errorMessage: 'resources.applications.notifications.copy_error',
    });
    const translate = useTranslate();
    return (
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
                    <Typography variant="body1" gutterBottom>
                        {translate(
                            'resources.applications.notifications.secret_generated_message'
                        )}
                    </Typography>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        {translate('ra.action.close')}
                    </Button>
                </DialogActions>
            </div>
        </div>
    );
};

const ShowGenerateDialog = ({ handleClose, generate }) => {
    const translate = useTranslate();
    return (
        <>
            <DialogTitle id="form-dialog-title">
                {translate('resources.applications.actions.generateSecret')}
            </DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1">
                    {`${translate(
                        'resources.applications.notifications.generate_secret_warning_1'
                    )}
                    ${translate(
                        'resources.applications.notifications.generate_secret_warning_2'
                    )}`}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="secondary"
                >
                    {translate('ra.action.cancel')}
                </Button>
                <Button onClick={generate} variant="contained" color="primary">
                    {translate('resources.applications.actions.generateSecret')}
                </Button>
            </DialogActions>
        </>
    );
};
