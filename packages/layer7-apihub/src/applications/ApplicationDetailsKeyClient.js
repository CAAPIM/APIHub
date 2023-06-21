import React, { Fragment } from 'react';
import { Labeled, TextField } from 'react-admin';
import { useTranslate } from 'ra-core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import IconFileCopy from '@material-ui/icons/FileCopy';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import ListItem from '@material-ui/core/ListItem';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import classnames from 'classnames';
import moment from 'moment';

import { useCopyToClipboard } from '../ui';

const getStatusColor = (classes, status) => {
    switch (status) {
        case 'ENABLED':
            return {
                statusLabel: 'Enabled',
                statusColorClass: classes.enabled,
            };
        case 'DISABLED':
            return {
                statusLabel: 'Disabled',
                statusColorClass: classes.disabled,
            };
        case 'DELETE_FAILED':
            return {
                statusLabel: 'Delete_Failed',
                statusColorClass: classes.disabled,
            };
        case 'EXPIRED':
            return {
                statusLabel: 'Expired',
                statusColorClass: classes.expired,
            };
        default:
            return {
                statusLabel: 'Disabled',
                statusColorClass: classes.disabled,
            };
    }
};

export const ApplicationDetailsKeyClient = props => {
    const { data, includeSecret, isKeyExpiryEnabled } = props;
    const classes = useStyles();
    const translate = useTranslate();
    const copyToClipboard = useCopyToClipboard({
        successMessage: 'resources.applications.notifications.copy_success',
        errorMessage: 'resources.applications.notifications.copy_error',
    });
    if (!data || !data.apiKey) {
        return null;
    }

    const { statusLabel, statusColorClass } = getStatusColor(
        classes,
        data.status
    );

    const getExpiryDateText = data => {
        let expiryDateText = translate(
            'resources.applications.fields.none'
        );
        const secretExpiryTs = data.secretExpiryTs;
        if (isKeyExpiryEnabled && secretExpiryTs) {
            const keyExpiryDate = moment(secretExpiryTs);
            expiryDateText = keyExpiryDate.format(
                'dddd, MMMM Do YYYY, HH:mm:ss'
            );
        }
        return expiryDateText;
    };

    const getExpiryDateSubText = data => {
        let expiryDateSubText = '';
        const secretExpiryTs = data.secretExpiryTs;
        const keyStatus = data.status;
        if (isKeyExpiryEnabled && secretExpiryTs) {
            const keyExpiryDate = moment(secretExpiryTs);
            const currentTime = moment();
            if (keyStatus === 'EXPIRED') {
                expiryDateSubText = translate(
                    'resources.applications.status.expired'
                );
            } else {
                const days = keyExpiryDate.diff(currentTime, 'days');
                let suffix = translate(
                    'resources.applications.fields.days'
                );
                if (days === 1) {
                    suffix = translate(
                        'resources.applications.fields.day'
                    );
                }
                expiryDateSubText = `${days} ${suffix}`;
            }
        }
        return expiryDateSubText;
    };

    const getExpiryDateSubTextClass = data => {
        let expiryDateSubTextClass = '';
        const keyStatus = data.status;
        if (keyStatus === 'EXPIRED') {
            expiryDateSubTextClass = classes.expiredKeyStatus;
        }
        return expiryDateSubTextClass;
    };

    return (
        <ListItem
            disableGutters
            dense
            divider={includeSecret}
            className={classes.root}
        >
            <ExpansionPanel className={classes.expansionPanel}>
                <ExpansionPanelSummary
                    className={classes.expansionPanelSummary}
                    expandIcon={
                        <ExpandMoreIcon
                            className={classes.expandMoreIconSummary}
                        />
                    }
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant="h3" className={classes.apiKeyName}>
                        <span id="apiKeyName">{data.name}</span>
                        <span
                            className={classnames(
                                classes.status,
                                statusColorClass
                            )}
                        >
                            {translate(
                                `resources.applications.status.${statusLabel.toLowerCase()}`
                            )}
                        </span>
                        {data.defaultKey && (
                            <Chip
                                className={classes.chip}
                                label={translate(
                                    'resources.applications.fields.default'
                                )}
                            />
                        )}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails
                    classes={{
                        root: classes.expansionPanelDetails,
                    }}
                >
                    <Grid container>
                        {data.oauthCallbackUrl && (
                            <Grid item md={6} sm={6} xs={12}>
                                <Labeled
                                    id="oauthCallbackUrl"
                                    label="resources.applications.fields.callbackUrl"
                                    classes={classes}
                                    className={classes.fieldLabel}
                                >
                                    <div className={classes.fieldValue}>
                                        <TextField
                                            id="oauthCallbackUrl"
                                            record={data}
                                            source="oauthCallbackUrl"
                                        />
                                    </div>
                                </Labeled>
                            </Grid>
                        )}
                        <Grid item md={6} sm={6} xs={12}>
                            <Labeled
                                // On <Labeled />, this will translate in a correct `for` attribute on the label
                                id="apiKeyClientID"
                                label={
                                    'resources.applications.fields.apiKeyClientID'
                                }
                                classes={classes}
                                className={classes.fieldLabel}
                            >
                                <Typography
                                    variant="body2"
                                    className={classes.fieldContent}
                                >
                                    <span
                                        id="apiKeyClientID"
                                        className={classes.fieldValue}
                                    >
                                        {data.apiKey}
                                    </span>
                                    <IconButton
                                        className={classes.buttonCopy}
                                        color="primary"
                                        title={translate(
                                            'resources.applications.notifications.copy_to_clipboard'
                                        )}
                                        value={data.apiKey}
                                        onClick={copyToClipboard}
                                    >
                                        <IconFileCopy
                                            className={classes.iconCopy}
                                        />
                                    </IconButton>
                                </Typography>
                            </Labeled>
                        </Grid>
                    </Grid>
                    <Grid container>
                        {data.oauthScope && (
                            <Grid item md={6} sm={6} xs={12}>
                                <Labeled
                                    // On <Labeled />, this will translate in a correct `for` attribute on the label
                                    id="oauthScope"
                                    label="resources.applications.fields.scope"
                                    classes={classes}
                                    className={classes.fieldLabel}
                                >
                                    <div className={classes.fieldValue}>
                                        <TextField
                                            id="oauthScope"
                                            record={data}
                                            source="oauthScope"
                                        />
                                    </div>
                                </Labeled>
                            </Grid>
                        )}
                        {includeSecret && (
                            <Grid item md={6} sm={6} xs={12}>
                                <Labeled
                                    // on Labeled, this will translate in a correct `for` attribute on the label
                                    id="sharedSecretClientSecret"
                                    label="resources.applications.fields.sharedSecretClientSecret"
                                    classes={classes}
                                    className={classes.fieldLabel}
                                >
                                    <Typography
                                        variant="body2"
                                        className={classes.fieldContent}
                                    >
                                        <span
                                            id="sharedSecretClientSecret"
                                            className={classes.fieldValue}
                                        >
                                            {data.keySecret}
                                        </span>
                                        {data.keySecret &&
                                            !data.keySecret.includes(
                                                '****'
                                            ) && (
                                                <IconButton
                                                    className={
                                                        classes.buttonCopy
                                                    }
                                                    color="primary"
                                                    title={translate(
                                                        'resources.applications.notifications.copy_to_clipboard'
                                                    )}
                                                    value={data.keySecret}
                                                    onClick={copyToClipboard}
                                                >
                                                    <IconFileCopy
                                                        className={
                                                            classes.iconCopy
                                                        }
                                                    />
                                                </IconButton>
                                            )}
                                    </Typography>
                                </Labeled>
                            </Grid>
                        )}
                    </Grid>
                    <Grid container>
                        {data.oauthType && (
                            <Grid item md={6} sm={6} xs={12}>
                                <Labeled
                                    // On <Labeled />, this will translate in a correct `for` attribute on the label
                                    id="oauthType"
                                    label="resources.applications.fields.type"
                                    classes={classes}
                                    className={classes.fieldLabel}
                                >
                                    <div className={classes.fieldValue}>
                                        <TextField
                                            id="oauthType"
                                            record={data}
                                            source="oauthType"
                                        />
                                    </div>
                                </Labeled>
                            </Grid>
                        )}
                        {isKeyExpiryEnabled && (
                            <Grid item md={6} sm={6} xs={12}>
                                <Labeled
                                    // On <Labeled />, this will translate in a correct `for` attribute on the label
                                    id="expiryDate"
                                    label={
                                        'resources.applications.fields.expiryDate'
                                    }
                                    classes={classes}
                                    className={classes.fieldLabel}
                                >
                                    <Fragment>
                                        <Typography
                                            variant="body2"
                                            className={classes.fieldContent}
                                        >
                                            <span
                                                className={classes.fieldValue}
                                            >
                                                {getExpiryDateText(data)}
                                            </span>
                                        </Typography>
                                        <Typography
                                            className={getExpiryDateSubTextClass(
                                                data
                                            )}
                                            variant="body2"
                                        >
                                            {getExpiryDateSubText(data)}
                                        </Typography>
                                    </Fragment>
                                </Labeled>
                            </Grid>
                        )}
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </ListItem>
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'list-item',
        },
        status: {
            fontSize: '14px',
            marginLeft: theme.spacing(2),
            '&:before': {
                borderRadius: '10px',
                content: '""',
                display: 'inline-block',
                height: '10px',
                marginTop: '-6px',
                marginRight: theme.spacing(1),
                top: '50%',
                width: '10px',
            },
        },
        enabled: {
            color: '#4CAF50',
            '&:before': {
                backgroundColor: '#4CAF50',
            },
        },
        expired: {
            color: '#B30303',
            '&:before': {
                backgroundColor: '#B30303',
            },
        },
        expiredKeyStatus: {
            color: '#B30303',
            fontFamily: 'clear-sans-bold',
        },
        disabled: {
            color: '#696969',
            '&:before': {
                backgroundColor: '#696969',
            },
        },
        expansionPanel: {
            boxShadow: 'none',
        },
        expandMoreIconSummary: {
            color: theme.palette.primary.main || '#333333',
        },
        expansionPanelSummary: {
            '& > div': {
                margin: `${theme.spacing(1)}px 0 !important`,
            },
        },
        fieldLabel: {
            margin: `0 ${theme.spacing(1)}px ${theme.spacing(1)}px`,
            minWidth: '100px',
        },
        chip: {
            marginLeft: theme.spacing(2),
            height: '21px',
        },
        expandCollapseButton: {
            color: theme.palette.primary.main,
            float: 'right',
        },
        expansionPanelDetails: {
            display: 'block',
            padding: `0 ${theme.spacing(1)}px`,
        },
        fieldContent: {},
        fieldValue: {
            color: theme.palette.primary.textHub || '#333333',
            fontFamily: theme.typography.textHub,
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: 'normal',
            lineHeight: '20px',
            // textTransform: 'titlecase',
        },
        buttonCopy: {
            padding: 0,
            marginLeft: '10px',
        },
        iconCopy: {
            fontSize: '14px',
            color: theme.palette.secondary.main,
        },
        label: {
            color: theme.palette.primary.textHub || '#333333',
            fontFamily: theme.typography.textHub,
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: 'bold',
            lineHeight: '22px',
            transform: 'unset',
        },
        apiKeyName: {
            color: theme.palette.primary.main,
            fontFamily: theme.typography.apiHubFont,
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '22px',
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(1),
            textTransform: 'none',
        },
    }),
    {
        name: 'Layer7ApplicationKeyClient',
    }
);
