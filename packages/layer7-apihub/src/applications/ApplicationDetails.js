import React from 'react';
import { Labeled, TextField } from 'react-admin';
import { useTranslate } from 'ra-core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { useUserContext } from '../userContexts';
import { ApplicationApisList } from './ApplicationApisList';
import { ApplicationDetailsOverviewField } from './ApplicationDetailsOverviewField';
import { ApplicationKeyClient } from './ApplicationKeyClient';
import { ApplicationKeySecret } from './ApplicationKeySecret';
import { isApplicationPendingOrDisabled } from './isApplicationPending';
import { isPublisher, isOrgAdmin, isOrgBoundUser } from '../userContexts';

export const ApplicationDetails = ({ record }) => {
    const classes = useStyles();
    const gridClasses = useGridStyles();
    const rightGridClasses = useRightGridStyles();
    const contentLabelClasses = useContentStyles();
    const applicationDetailsOverviewClasses = useApplicationDetailsOverviewStyles();
    const translate = useTranslate();

    const apiIds = (record.apiIds && record.apiIds.results) || [];

    const [userContext] = useUserContext();
    const canEdit = isPublisher(userContext) || isOrgAdmin(userContext);
    const isEditDisabled = isEditApplicationDisabled(userContext, record);
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
                            className={classes.field}
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
                        <ApplicationKeyClient
                            id={record.id}
                            record={record}
                            labelClasses={contentLabelClasses}
                        />
                    </Grid>
                    {record.keySecret && (
                        <Grid item>
                            <ApplicationKeySecret
                                id={record.id}
                                record={record}
                                isEditDisabled={isEditDisabled}
                                labelClasses={contentLabelClasses}
                            />
                        </Grid>
                    )}
                </Grid>
                <Grid
                    container
                    item
                    md={4}
                    sm={12}
                    direction="column"
                    classes={rightGridClasses}
                    className={classes.configuration}
                    justify="flex-start"
                >
                    <Grid item>
                        <Labeled
                            // On <Labeled />, this will translate in a correct `for` attribute on the label
                            id="description"
                            label="resources.applications.fields.description"
                            classes={contentLabelClasses}
                            className={classes.field}
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
                                'resources.applications.notifications.configuration'
                            )}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Labeled
                            // On <Labeled />, this will translate in a correct `for` attribute on the label
                            id="oauthCallbackUrl"
                            label="resources.applications.fields.oauthCallbackUrl"
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
                            label="resources.applications.fields.oauthScope"
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
                            label="resources.applications.fields.oauthType"
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
                </Grid>
            </Grid>
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
                        <ApplicationApisList apis={apiIds} />
                    </Grid>
                </Grid>
            )}
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
            textTransform: 'uppercase',
            fontWeight: theme.typography.fontWeightBold,
            fontSize: '1rem',
            margin: theme.spacing(1, 1, 2, 1),
        },
        field: {
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
    },
}));

const useContentStyles = makeStyles(theme => ({
    label: {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.5rem',
    },
}));

const useGridStyles = makeStyles(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
}));

const useRightGridStyles = makeStyles(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        borderLeft: `1px solid ${theme.palette.divider}`,
    },
}));
