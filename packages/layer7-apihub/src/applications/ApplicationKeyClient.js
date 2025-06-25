// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { Labeled, useTranslate } from 'react-admin';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'tss-react/mui';
import IconButton from '@mui/material/IconButton';
import IconFileCopy from '@mui/icons-material/FileCopy';
import Chip from '@mui/material/Chip';
import get from 'lodash/get';

import { useCopyToClipboard } from '../ui';

export const ApplicationKeyClient = props => {
    const { labelClasses, data, includeSecret, isEditMode } = props;
    const { classes } = useStyles(props);
    const translate = useTranslate();
    const copyToClipboard = useCopyToClipboard({
        successMessage: 'resources.applications.notifications.copy_success',
        errorMessage: 'resources.applications.notifications.copy_error',
    });
    if (!data || !data.apiKey) {
        return null;
    }
    return (
        <Grid>
            <Grid item>
                <Labeled
                    // On <Labeled />, this will translate in a correct `for` attribute on the label
                    id="apiKeyClientID"
                    label={
                        <span>
                            <span>
                                {translate(
                                    'resources.applications.fields.apiKeyClientID'
                                )}
                            </span>
                            {isEditMode && get(data, 'defaultKey') ? (
                                <Chip
                                    className={classes.chip}
                                    label={translate(
                                        'resources.applications.fields.default'
                                    )}
                                />
                            ) : null}
                        </span>
                    }
                    classes={labelClasses}
                    className={classes.field}
                >
                    <Typography
                        variant="body2"
                        className={classes.fieldContent}
                    >
                        <span id="apiKeyClientID">{data.apiKey}</span>
                        <IconButton
                            className={classes.buttonCopy}
                            title={translate(
                                'resources.applications.notifications.copy_to_clipboard'
                            )}
                            value={data.apiKey}
                            onClick={copyToClipboard}
                            size="large"
                        >
                            <IconFileCopy className={classes.iconCopy} />
                        </IconButton>
                    </Typography>
                </Labeled>
            </Grid>
            {includeSecret && (
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
                            <span id="sharedSecretClientSecret">
                                {data.keySecretHashed
                                    ? '********'
                                    : data.keySecret}
                            </span>
                            {data.keySecret && !data.keySecretHashed && (
                                <IconButton
                                    className={classes.buttonCopy}
                                    title={translate(
                                        'resources.applications.notifications.copy_to_clipboard'
                                    )}
                                    value={data.keySecret}
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
            )}
        </Grid>
    );
};

const useStyles = makeStyles({ name: 'Layer7ApplicationKeyClient' })(theme => ({
    field: {
        marginLeft: 0,
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        minWidth: '100px',
    },
    chip: {
        marginLeft: theme.spacing(1),
    },
    fieldContent: {},
    buttonCopy: {},
    iconCopy: {
        fontSize: '1rem',
        color: theme.palette.secondary.main,
    },
}));
