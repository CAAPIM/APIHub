import React from 'react';
import { Labeled, TextField } from 'react-admin';
import { useTranslate } from 'ra-core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';

import { useUserContext } from '../userContexts';
import { ApplicationApisList } from './ApplicationApisList';
import { ApplicationDetailsOverviewField } from './ApplicationDetailsOverviewField';
import { ApplicationKeyClient } from './ApplicationKeyClient';
import { isApplicationPendingOrDisabled } from './isApplicationPending';
import { isPublisher, isOrgAdmin, isOrgBoundUser } from '../userContexts';

export const ApplicationDetails = ({ record }) => {
    const classes = useStyles();
    const gridClasses = useGridStyles();
    const contentLabelClasses = useContentStyles();
    const applicationDetailsOverviewClasses = useApplicationDetailsOverviewStyles();
    const translate = useTranslate();

    const apiIds = (record.apiIds && record.apiIds.results) || [];

    const [userContext] = useUserContext();
    const canEdit = isPublisher(userContext) || isOrgAdmin(userContext);
    const isEditDisabled = isEditApplicationDisabled(userContext, record);
    const isOrgUser = isOrgBoundUser(userContext);
    return (
        <>
            <Grid className={classes.root} container spacing={3}>
                <Grid
                    container
                    item
                    md={8}
                    sm={12}
                    direction="column"
                    classes={gridClasses}
                    className={classes.details}
                >
                    <Grid item>
                        <Labeled
                            // On <Labeled />, this will translate in a correct `for` attribute on the label
                            id="overview"
                            label="resources.applications.fields.overview"
                            classes={contentLabelClasses}
                            className={classes.mainField}
                        >
                            <ApplicationDetailsOverviewField
                                id="overview"
                                classes={applicationDetailsOverviewClasses}
                                record={record}
                                canEdit={canEdit}
                            />
                        </Labeled>
                    </Grid>
                    <Grid item>
                        {!isOrgUser && (
                            <Labeled
                                // On <Labeled />, this will translate in a correct `for` attribute on the label
                                label="resources.applications.fields.organization"
                                classes={contentLabelClasses}
                                className={classes.mainField}
                            >
                                <TextField
                                    id="organizationName"
                                    record={record}
                                    source="organizationName"
                                />
                            </Labeled>
                        )}
                        <Labeled
                            // On <Labeled />, this will translate in a correct `for` attribute on the label
                            label="resources.applications.fields.description"
                            classes={contentLabelClasses}
                            className={classes.mainField}
                        >
                            <TextField
                                id="description"
                                record={record}
                                source="description"
                            />
                        </Labeled>
                    </Grid>
                    <Grid item>
                        <Typography variant="h3" className={classes.subtitle}>
                            {translate(
                                'resources.applications.fields.customField'
                            )}
                        </Typography>
                        {record.customFieldValues &&
                            record.customFieldValues.map(item => (
                                <Labeled
                                    // On <Labeled />, this will translate in a correct `for` attribute on the label
                                    label={item.Name}
                                    classes={contentLabelClasses}
                                    className={classes.field}
                                >
                                    <TextField record={item} source="Value" />
                                </Labeled>
                            ))}

                        {apiIds.length > 0 && (
                            <Grid className={classes.root} container>
                                <Grid
                                    item
                                    container
                                    direction="row"
                                    justify="center"
                                    md={12}
                                    sm={12}
                                >
                                    <ApplicationApisList application={record} />
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    md={8}
                    sm={12}
                    direction="column"
                    classes={gridClasses}
                    className={classes.configuration}
                    justify="flex-start"
                >
                    <Grid item>
                        <Typography variant="h3" className={classes.subtitle}>
                            {translate(
                                'resources.applications.fields.authCredentials'
                            )}
                            <Chip
                                className={classes.chip}
                                label={translate(
                                    'resources.applications.fields.default'
                                )}
                            />
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Labeled
                            // On <Labeled />, this will translate in a correct `for` attribute on the label
                            id="oauthCallbackUrl"
                            label="resources.applications.fields.callbackUrl"
                            classes={contentLabelClasses}
                            className={classes.field}
                        >
                            <TextField
                                id="oauthCallbackUrl"
                                record={record}
                                source="OauthCallbackUrl"
                            />
                        </Labeled>
                    </Grid>
                    <Grid item>
                        <Labeled
                            // On <Labeled />, this will translate in a correct `for` attribute on the label
                            id="oauthScope"
                            label="resources.applications.fields.scope"
                            classes={contentLabelClasses}
                            className={classes.field}
                        >
                            <TextField
                                id="oauthScope"
                                record={record}
                                source="OauthScope"
                            />
                        </Labeled>
                    </Grid>
                    <Grid item>
                        <Labeled
                            // On <Labeled />, this will translate in a correct `for` attribute on the label
                            id="oauthType"
                            label="resources.applications.fields.type"
                            classes={contentLabelClasses}
                            className={classes.field}
                        >
                            <TextField
                                id="oauthType"
                                record={record}
                                source="OauthType"
                            />
                        </Labeled>
                    </Grid>
                    <Grid item className={classes.mainField}>
                        <ApplicationKeyClient
                            id={record.id}
                            data={record}
                            includeSecret={true}
                            labelClasses={contentLabelClasses}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

const isEditApplicationDisabled = (userContext, { status, disabledByType }) => {
    return (
        isOrgBoundUser(userContext) &&
        isApplicationPendingOrDisabled(status, disabledByType)
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'flex',
            fontFamily: theme.typography.body2.fontFamily,
            fontSize: theme.typography.caption.fontSize,
            margin: theme.spacing(0),
        },
        details: {},
        configuration: {},
        subtitle: {
            fontWeight: theme.typography.fontWeightBold,
            fontSize: '1rem',
            margin: theme.spacing(1, 1, 2, 1),
        },
        field: {
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(1),
            minWidth: '100px',
            width: '100%',
        },
        mainField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            minWidth: '100px',
            width: '100%',
        },
        type: {
            textTransform: 'uppercase',
        },
        icon: {
            fontSize: '1rem',
        },
        chip: {
            marginLeft: theme.spacing(1),
            height: theme.spacing(3),
        },
    }),
    {
        name: 'Layer7ApplicationDetails',
    }
);

const useApplicationDetailsOverviewStyles = makeStyles(theme => ({
    markdown: {
        overflowY: 'scroll',
        height: '200px',
        paddingRight: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
}));

const useContentStyles = makeStyles(theme => ({
    label: {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.4rem',
    },
    mainLabel: {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.7rem',
    },
}));

const useGridStyles = makeStyles(theme => ({
    root: {
        borderBottom: 'none',
    },
}));
