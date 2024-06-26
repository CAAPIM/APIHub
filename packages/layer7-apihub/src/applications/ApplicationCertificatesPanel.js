import React, { Fragment, useState } from 'react';
import { FileField, FileInput, TextInput, useDataProvider } from 'react-admin';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useTranslate } from 'ra-core';
import moment from 'moment';
import momentTimeZone from 'moment-timezone';

import { useLayer7Notify } from '../useLayer7Notify';
import { CERTIFICATE_DISPLAY_FORMAT } from './constants';

export const ApplicationCertificatesPanel = ({
    allowAddCertificate,
    appCertificates,
    application,
    assignedCertName,
    certFileName,
    fetchApplicationCerts,
    getErrorMessageFromError,
    isSubmitRequest,
    reloadForm,
    setUploadedCertFile,
    uploadedCertFile,
}) => {
    const classes = useStyles();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const [certificateDeleteStateMap, setCertificateDeleteStateMap] = useState(
        {}
    );
    const [certificateSearchText, setCertificateSearchText] = useState('');
    const [showAddCertificateDialog, setShowAddCertificateDialog] = useState(
        false
    );
    const notify = useLayer7Notify();

    // add certificate
    const addCertificate = async () => {
        if (!uploadedCertFile || !certFileName || !assignedCertName) {
            return;
        }

        const failureMessage = isSubmitRequest
            ? translate(
                  'resources.applications.notifications.certificate_upload_request_failure'
              )
            : translate(
                  'resources.applications.notifications.certificate_upload_failure'
              );
        const successMessage = isSubmitRequest
            ? translate(
                  'resources.applications.notifications.certificate_upload_request_success'
              )
            : translate(
                  'resources.applications.notifications.certificate_upload_success'
              );
        await dataProvider.create(
            'applicationCertificates',
            {
                data: {
                    certificateContent: uploadedCertFile,
                    certificateFileName: certFileName,
                    name: assignedCertName,
                },
                appUuid: application.id,
            },
            {
                onFailure: error => {
                    let errorMessage = getErrorMessageFromError(error);
                    notify(`${failureMessage}, ${errorMessage}`, 'error');
                    reloadForm();
                },
                onSuccess: ({ data }) => {
                    fetchApplicationCerts();
                    reloadForm();
                    notify(successMessage);
                },
            }
        );
    };

    const handleUploadCertificate = () => {
        addCertificate();
        setShowAddCertificateDialog(false);
    };

    const handleCancelUploadCertificate = () => {
        setUploadedCertFile();
        setShowAddCertificateDialog(false);
    };

    const renderUploadCertificateDialog = ({ show = false }) => {
        const saveBtnText = isSubmitRequest
            ? translate('resources.applications.actions.submitForApproval')
            : translate('resources.applications.actions.save');
        return (
            <Dialog open={show} aria-labelledby="form-dialog">
                <DialogTitle id="form-dialog-title">
                    {translate(
                        'resources.applications.actions.uploadCertificate'
                    )}
                </DialogTitle>
                <DialogContent>
                    <TextInput
                        source="givenCertName"
                        type="text"
                        label="resources.applications.fields.certificateName"
                        helperText="resources.applications.validation.certificate_name_caption"
                        variant="filled"
                        fullWidth
                    />
                    <FileInput
                        helperText="resources.applications.validation.certificate_file_input_caption"
                        multiple={false}
                        source="uploadedCertFile"
                    >
                        <FileField source="src" title="title" />
                    </FileInput>
                    {isSubmitRequest && (
                        <span>
                            {translate(
                                'resources.applications.status.certificate_submission'
                            )}
                        </span>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCancelUploadCertificate}
                        variant="outlined"
                        color="secondary"
                    >
                        {translate('resources.applications.actions.cancel')}
                    </Button>
                    <Button
                        color="primary"
                        disabled={!uploadedCertFile || !assignedCertName}
                        onClick={handleUploadCertificate}
                        variant="contained"
                    >
                        {saveBtnText}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    const onCertificateSearchChange = evt =>
        setCertificateSearchText(evt.target.value);

    const cancelDeleteCertificate = uuid => {
        setCertificateDeleteStateMap({
            ...certificateDeleteStateMap,
            [uuid]: false,
        });
    };

    const deleteCertificate = uuid => {
        setCertificateDeleteStateMap({
            ...certificateDeleteStateMap,
            [uuid]: true,
        });
    };

    const confirmDeleteCertificate = uuid => {
        setCertificateDeleteStateMap({
            ...certificateDeleteStateMap,
            [uuid]: false,
        });

        const successMessage = isSubmitRequest
            ? translate(
                  'resources.applications.notifications.certificate_delete_request_success'
              )
            : translate(
                  'resources.applications.notifications.certificate_delete_success'
              );
        const failureMessage = isSubmitRequest
            ? translate(
                  'resources.applications.notifications.certificate_delete_request_failure'
              )
            : translate(
                  'resources.applications.notifications.certificate_delete_failure'
              );
        dataProvider.delete(
            'applicationCertificates',
            {
                applicationUuid: application.id,
                certificateUuid: uuid,
            },
            {
                onFailure: error => {
                    notify(error || failureMessage, 'error');
                    fetchApplicationCerts();
                    reloadForm();
                },
                onSuccess: () => {
                    notify(successMessage);
                    fetchApplicationCerts();
                    reloadForm();
                },
            }
        );
    };

    const renderCertificate = item => {
        const time = moment(item.expiryTs);
        const dateString = time.format(CERTIFICATE_DISPLAY_FORMAT);
        const deleteText = isSubmitRequest
            ? translate('resources.applications.actions.submitDelete')
            : translate('resources.applications.actions.delete');
        const renderActionCell = () => {
            if (certificateDeleteStateMap[item.id]) {
                return (
                    <Fragment>
                        <Button
                            aria-label={translate(
                                'resources.applications.actions.confirm'
                            )}
                            className={classes.certificateActionDeleteBtn}
                            color="primary"
                            onClick={() => confirmDeleteCertificate(item.id)}
                            variant="text"
                        >
                            {translate(
                                'resources.applications.actions.confirm'
                            )}
                        </Button>
                        <Button
                            aria-label={translate(
                                'resources.applications.actions.cancel'
                            )}
                            color="primary"
                            onClick={() => cancelDeleteCertificate(item.id)}
                            variant="text"
                        >
                            {translate('resources.applications.actions.cancel')}
                        </Button>
                    </Fragment>
                );
            }
            return (
                <Button
                    aria-label={translate(
                        'resources.applications.actions.delete'
                    )}
                    className={classes.certificateActionDeleteBtn}
                    color="primary"
                    onClick={() => deleteCertificate(item.id)}
                    variant="text"
                >
                    {deleteText}
                </Button>
            );
        };
        return (
            <TableRow key={item.uuid}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                    <div className={classes.subjectNameDiv}>
                        {item.subjectName}
                    </div>
                </TableCell>
                <TableCell>{item.thumbPrintSha256}</TableCell>
                <TableCell>{dateString}</TableCell>
                {allowAddCertificate && (
                    <TableCell
                        className={classes.certificateActionBtnContainer}
                    >
                        {renderActionCell()}
                    </TableCell>
                )}
            </TableRow>
        );
    };

    const renderCertificates = () => {
        const zone = moment.tz(momentTimeZone.tz.guess()).zoneAbbr();
        const filteredCertificates =
            (appCertificates &&
                appCertificates.filter(item =>
                    item.name.includes(certificateSearchText)
                )) ||
            [];
        return (
            <div>
                <Table>
                    <TableHead className={classes.certificatesHeader}>
                        <TableRow>
                            <TableCell>
                                {translate(
                                    'resources.applications.fields.certificate'
                                )}
                            </TableCell>
                            <TableCell>
                                {translate(
                                    'resources.applications.fields.subjectDomain'
                                )}
                            </TableCell>
                            <TableCell>
                                {translate(
                                    'resources.applications.fields.shaThumbPrint'
                                )}
                            </TableCell>
                            <TableCell>
                                {translate(
                                    'resources.applications.fields.notValidAfter',
                                    { zone }
                                )}
                            </TableCell>
                            {allowAddCertificate && (
                                <TableCell>action</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCertificates.map(renderCertificate)}
                    </TableBody>
                </Table>
            </div>
        );
    };

    return (
        <div>
            <div className={classes.topbar}>
                <div>
                    <TextField
                        className={classes.certSearchField}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        onChange={onCertificateSearchChange}
                        value={certificateSearchText}
                        variant={'filled'}
                    />
                </div>
                <div>
                    {allowAddCertificate && (
                        <div className={classes.addCertificateContainer}>
                            <Button
                                className={classes.buttonGenerate}
                                color="primary"
                                variant="contained"
                                onClick={() =>
                                    setShowAddCertificateDialog(true)
                                }
                                aria-label={translate(
                                    'resources.applications.actions.addCertificate'
                                )}
                                value={0}
                            >
                                {translate(
                                    'resources.applications.actions.addCertificate'
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            {renderUploadCertificateDialog({
                show: showAddCertificateDialog,
            })}
            {renderCertificates()}
        </div>
    );
};

const useStyles = makeStyles(
    theme => ({
        certificateActionBtnContainer: {
            width: 220,
        },
        certificateActionDeleteBtn: {
            color: theme.palette.error.main,
        },
        addCertificateContainer: {
            marginBottom: 12,
            marginRight: 12,
            marginTop: 12,
            textAlign: 'right',
        },
        certificatesHeader: {
            backgroundColor: theme.palette.background.default,
            fontWeight: theme.typography.fontWeightBold,
            textTransform: 'uppercase',
        },
        certSearchField: {
            margin: 12,
        },
        subjectNameDiv: {
            width: 400,
            textOverflow: 'ellipsis',
            textWrap: 'wrap',
            wordWrap: 'break-word',
        },
        topbar: {
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
        },
    }),
    {
        name: 'ApplicationCertificatesPanel',
    }
);
