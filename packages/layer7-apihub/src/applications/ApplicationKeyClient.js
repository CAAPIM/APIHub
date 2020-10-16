import React from 'react';
import { Labeled } from 'react-admin';
import { useTranslate } from 'ra-core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import IconFileCopy from '@material-ui/icons/FileCopy';

import { useCopyToClipboard } from '../ui';

export const ApplicationKeyClient = props => {
    const { labelClasses, record, data, includeSecret } = props;
    const classes = useStyles(props);
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
                    label="resources.applications.fields.apiKeyClientID"
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
                            color="primary"
                            title={translate(
                                'resources.applications.notifications.copy_to_clipboard'
                            )}
                            value={data.apiKey}
                            onClick={copyToClipboard}
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
                                {data.keySecret}
                            </span>
                            {data.keySecret &&
                                !data.keySecret.includes('****') && (
                                    <IconButton
                                        className={classes.buttonCopy}
                                        color="primary"
                                        title={translate(
                                            'resources.applications.notifications.copy_to_clipboard'
                                        )}
                                        value={data.keySecret}
                                        onClick={copyToClipboard}
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

const useStyles = makeStyles(
    theme => ({
        field: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            marginBottom: theme.spacing(1),
            minWidth: '100px',
        },
        fieldContent: {},
        buttonCopy: {},
        iconCopy: {
            fontSize: '1rem',
            color: theme.palette.secondary.main,
        },
    }),
    {
        name: 'Layer7ApplicationKeyClient',
    }
);
