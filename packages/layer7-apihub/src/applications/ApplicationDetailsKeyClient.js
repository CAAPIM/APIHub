// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { Fragment } from 'react';
import { Labeled, TextField, useDataProvider, useTranslate } from 'react-admin';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import IconFileCopy from '@mui/icons-material/FileCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chip from '@mui/material/Chip';
import ListItem from '@mui/material/ListItem';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import moment from 'moment';
import momentTimeZone from 'moment-timezone';
import forEach from 'lodash/forEach';

import { CERTIFICATE_DISPLAY_FORMAT } from './constants';
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
        case 'PENDING_REGISTRATION':
            return {
                statusLabel: 'Pending_registration',
                statusColorClass: classes.disabled,
            };
        default:
            return {
                statusLabel: 'Disabled',
                statusColorClass: classes.disabled,
            };
    }
};

export const ApplicationDetailsKeyClient = props => {
    const { appCertificates, data, includeSecret, isKeyExpiryEnabled } = props;
    const { classes, cx } = useStyles();
    const translate = useTranslate();
    const copyToClipboard = useCopyToClipboard({
        successMessage: 'resources.applications.notifications.copy_success',
        errorMessage: 'resources.applications.notifications.copy_error',
    });
    const [authProviders, setAuthProviders] = React.useState([]);
    const [authProvidersMap, setAuthProvidersMap] = React.useState({});
    const dataProvider = useDataProvider();

    React.useEffect(() => {
        (async () => {
            const { data } =
                (await dataProvider.getList('authProviders')) || {};
            setAuthProviders(data);
        })();
    }, [dataProvider]);

    React.useEffect(() => {
        const providersMap = {};
        forEach(authProviders, item => {
            providersMap[item.id] = item.name;
        });
        setAuthProvidersMap(providersMap);
    }, [authProviders]);

    if (!data || !data.apiKey) {
        return null;
    }

    const { statusLabel, statusColorClass } = getStatusColor(
        classes,
        data.status
    );

    const getExpiryDateText = data => {
        let expiryDateText = translate('resources.applications.fields.none');
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
                let suffix = translate('resources.applications.fields.days');
                if (days === 1) {
                    suffix = translate('resources.applications.fields.day');
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

    const renderCertificate = item => {
        const time = moment(item.expiryTs);
        const dateString = time.format(CERTIFICATE_DISPLAY_FORMAT);
        return (
            <TableRow key={item.uuid}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{dateString}</TableCell>
            </TableRow>
        );
    };

    const renderCertificates = () => {
        const zone = moment.tz(momentTimeZone.tz.guess()).zoneAbbr();
        return (
            <div>
                <Table>
                    <TableHead className={classes.certificatesHeader}>
                        <TableRow>
                            <TableCell>Certificate</TableCell>
                            <TableCell>
                                {translate(
                                    'resources.applications.fields.notValidAfter',
                                    { zone }
                                )}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appCertificates.map(renderCertificate)}
                    </TableBody>
                </Table>
            </div>
        );
    };

    return (
        <ListItem
            disableGutters
            dense
            divider={includeSecret}
            className={classes.root}
        >
            <Accordion className={classes.expansionPanel}>
                <AccordionSummary
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
                        <span className={cx(classes.status, statusColorClass)}>
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
                </AccordionSummary>
                <AccordionDetails
                    classes={{
                        root: classes.expansionPanelDetails,
                    }}
                >
                    <Grid container>
                        {data.oauthCallbackUrl && (
                            <Grid item md={6} sm={6} xs={12}>
                                <Labeled
                                    id="oauthCallbackUrl"
                                    label={translate(
                                        'resources.applications.fields.callbackUrl'
                                    )}
                                    classes={classes}
                                    className={classes.fieldLabel}
                                >
                                    <Typography
                                        variant="body2"
                                        className={classes.fieldContent}
                                    >
                                        <TextField
                                            id="oauthCallbackUrl"
                                            record={data}
                                            source="oauthCallbackUrl"
                                            className={classes.fieldValue}
                                        />
                                    </Typography>
                                </Labeled>
                            </Grid>
                        )}
                        <Grid item md={6} sm={6} xs={12}>
                            {data.authMethod === 'NONE' && (
                                <Labeled
                                    // On <Labeled />, this will translate in a correct `for` attribute on the label
                                    id="apiKeyAuthProvider"
                                    label={translate(
                                        'resources.applications.fields.authprovider'
                                    )}
                                    classes={classes}
                                    className={classes.fieldLabel}
                                >
                                    <Typography
                                        variant="body2"
                                        className={classes.fieldContent}
                                    >
                                        <span
                                            id="apiKeyAuthProvider"
                                            className={classes.fieldValue}
                                        >
                                            {
                                                authProvidersMap[
                                                    data.authProviderUuid
                                                ]
                                            }
                                        </span>
                                    </Typography>
                                </Labeled>
                            )}
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            {data.authMethod === 'NONE' && (
                                <Labeled
                                    // On <Labeled />, this will translate in a correct `for` attribute on the label
                                    id="apiKeyAuthMethod"
                                    label={translate(
                                        'resources.applications.fields.authMethod'
                                    )}
                                    classes={classes}
                                    className={classes.fieldLabel}
                                >
                                    <span
                                        id="apiKeyAuthMethod"
                                        className={classes.fieldValue}
                                    >
                                        {translate(
                                            'resources.applications.fields.notAvailableAuthMethod'
                                        )}
                                    </span>
                                </Labeled>
                            )}
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Labeled
                                // On <Labeled />, this will translate in a correct `for` attribute on the label
                                id="apiKeyClientID"
                                label={translate(
                                    'resources.applications.fields.apiKeyClientID'
                                )}
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
                                        {data.status === 'PENDING_REGISTRATION'
                                            ? translate(
                                                  'resources.applications.fields.deferredClientId'
                                              )
                                            : data.apiKey}
                                    </span>
                                    {data.status !== 'PENDING_REGISTRATION' && (
                                        <IconButton
                                            className={classes.buttonCopy}
                                            title={translate(
                                                'resources.applications.notifications.copy_to_clipboard'
                                            )}
                                            value={data.apiKey}
                                            onClick={copyToClipboard}
                                            size="large"
                                        >
                                            <IconFileCopy
                                                className={classes.iconCopy}
                                            />
                                        </IconButton>
                                    )}
                                </Typography>
                            </Labeled>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            {data.authMethod === 'CERTIFICATE' && (
                                <Labeled
                                    // On <Labeled />, this will translate in a correct `for` attribute on the label
                                    id="certificates"
                                    label={translate(
                                        'resources.applications.fields.certificates'
                                    )}
                                    classes={classes}
                                    className={classes.fieldLabel}
                                >
                                    {renderCertificates()}
                                </Labeled>
                            )}
                        </Grid>
                    </Grid>
                    <Grid container>
                        {data.oauthScope && (
                            <Grid item md={6} sm={6} xs={12}>
                                <Labeled
                                    // On <Labeled />, this will translate in a correct `for` attribute on the label
                                    id="oauthScope"
                                    label={translate(
                                        'resources.applications.fields.scope'
                                    )}
                                    classes={classes}
                                    className={classes.fieldLabel}
                                >
                                    <Typography
                                        variant="body2"
                                        className={classes.fieldContent}
                                    >
                                        <TextField
                                            id="oauthScope"
                                            record={data}
                                            source="oauthScope"
                                        />
                                    </Typography>
                                </Labeled>
                            </Grid>
                        )}
                        {data.authMethod === 'SECRET' && includeSecret && (
                            <Grid item md={6} sm={6} xs={12}>
                                <Labeled
                                    // on Labeled, this will translate in a correct `for` attribute on the label
                                    id="sharedSecretClientSecret"
                                    label={translate(
                                        'resources.applications.fields.sharedSecretClientSecret'
                                    )}
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
                                                    title={translate(
                                                        'resources.applications.notifications.copy_to_clipboard'
                                                    )}
                                                    value={data.keySecret}
                                                    onClick={copyToClipboard}
                                                    size="large"
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
                                    label={translate(
                                        'resources.applications.fields.type'
                                    )}
                                    classes={classes}
                                    className={classes.fieldLabel}
                                >
                                    <Typography
                                        variant="body2"
                                        className={classes.fieldContent}
                                    >
                                        <TextField
                                            id="oauthType"
                                            record={data}
                                            source="oauthType"
                                        />
                                    </Typography>
                                </Labeled>
                            </Grid>
                        )}
                    </Grid>
                    <Grid container>
                        {data.authMethod === 'SECRET' && isKeyExpiryEnabled && (
                            <Grid item md={6} sm={6} xs={12}>
                                <Labeled
                                    // On <Labeled />, this will translate in a correct `for` attribute on the label
                                    id="expiryDate"
                                    label={translate(
                                        'resources.applications.fields.expiryDate'
                                    )}
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
                </AccordionDetails>
            </Accordion>
        </ListItem>
    );
};

const useStyles = makeStyles({ name: 'Layer7ApplicationKeyClient' })(theme => ({
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
            margin: `${theme.spacing(1)} 0 !important`,
        },
    },
    fieldLabel: {
        margin: `0 ${theme.spacing(1)} ${theme.spacing(1)}`,
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
        padding: `0 ${theme.spacing(1)}`,
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
    certificatesHeader: {
        backgroundColor: theme.palette.background.default,
        fontWeight: theme.typography.fontWeightBold,
        textTransform: 'uppercase',
    },
}));
