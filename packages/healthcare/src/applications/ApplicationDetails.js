import React from 'react';
import classnames from 'classnames';
import { Labeled, TextField } from 'react-admin';
import { useTranslate } from 'ra-core';
import {
    IconApi,
    ApplicationDetailsOverviewField,
    ApplicationKeyClient,
    ApplicationKeySecret,
    useUserContext,
} from 'layer7-apihub';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { ApplicationStatus, ApplicationStatusIcon } from './ApplicationStatus';
import { ApplicationApisList } from './ApplicationApisList';

export const ApplicationDetails = ({ record }) => {
    const classes = useStyles();
    const gridClasses = useGridStyles();
    const rightGridClasses = useRightGridStyles();
    const contentClasses = useContentStyles();
    const headerClasses = useHeaderStyles();
    const applicationDetailsOverviewClasses = useOverviewStyles();
    const translate = useTranslate();

    const apiIds = (record.apiIds && record.apiIds.results) || [];

    const [userContext] = useUserContext();
    const canEdit = userContext?.userDetails?.portalAdmin || false;

    return (
        <Grid className={classes.root} container spacing={3}>
            <Grid
                container
                item
                md={8}
                sm={12}
                direction="row"
                classes={gridClasses}
                className={classes.informations}
            >
                <Grid item container alignItems="center">
                    <ApplicationStatusIcon
                        record={record}
                        classes={{ root: headerClasses.icon }}
                    />
                    <Labeled
                        id="status"
                        label="resources.applications.fields.status"
                        classes={{
                            label: headerClasses.label,
                            value: headerClasses.value,
                        }}
                    >
                        <ApplicationStatus
                            id="status"
                            record={record}
                            variant="body1"
                        />
                    </Labeled>
                </Grid>
            </Grid>
            <Grid
                container
                item
                md={4}
                sm={12}
                classes={rightGridClasses}
                className={classes.informations}
            >
                <Grid item container alignItems="center">
                    <IconApi
                        className={classnames(
                            headerClasses.icon,
                            classes.apiIcon
                        )}
                    />
                    <Typography
                        id="apiUsage"
                        className={headerClasses.value}
                        variant="body1"
                        color="primary"
                    >
                        {apiIds.length} APIs Included
                    </Typography>
                </Grid>
            </Grid>
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
                        id="overview"
                        label="resources.applications.fields.overview"
                        classes={contentClasses}
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
                    <Labeled
                        id="description"
                        label="resources.applications.fields.description"
                        classes={contentClasses}
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
                    <div className={classes.subtitleContainer}>
                        <Typography variant="h3" className={classes.subtitle}>
                            {translate(
                                'resources.applications.notifications.configuration'
                            )}
                        </Typography>
                    </div>
                </Grid>
                <Grid item>
                    <Labeled
                        id="oauthCallbackUrl"
                        label="resources.applications.fields.oauthCallbackUrl"
                        classes={contentClasses}
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
                        id="oauthScope"
                        label="resources.applications.fields.oauthScope"
                        classes={contentClasses}
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
                        id="oauthType"
                        label="resources.applications.fields.oauthType"
                        classes={contentClasses}
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
                    <ApplicationKeyClient
                        id={record.id}
                        record={record}
                        labelClasses={contentClasses}
                    />
                </Grid>
                <Grid item>
                    <ApplicationApisList apis={apiIds} />
                </Grid>
            </Grid>
        </Grid>
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
        informations: {
            '&.MuiGrid-item': {
                backgroundColor: theme.palette.background.darker,
                paddingTop: theme.spacing(2),
                paddingBottom: theme.spacing(2),
                paddingLeft: theme.spacing(4),
                paddingRight: theme.spacing(4),
            },
            '& label': {
                color: theme.palette.primary.main,
                fontSize: '1rem',
            },
            '& label ~ div': {
                fontWeight: theme.typography.fontWeightBold,
                color: theme.palette.primary.main,
                padding: theme.spacing(0),
            },
        },
        details: {
            '&.MuiGrid-item': {
                paddingTop: theme.spacing(2),
                paddingBottom: theme.spacing(2),
                paddingLeft: theme.spacing(4),
                paddingRight: theme.spacing(4),
            },
            '& label, & h3': {
                color: theme.palette.primary.main,
                fontWeight: 'normal',
                marginBottom: theme.spacing(1),
                marginTop: theme.spacing(2),
            },
            '& h3': {
                marginTop: theme.spacing(4),
            },
            '& label ~ div': {
                display: 'flex',
                alignItems: 'center',
                padding: theme.spacing(0),
            },
        },
        configuration: {
            '&.MuiGrid-item': {
                backgroundColor: theme.palette.grey[100],
                paddingTop: theme.spacing(2),
                paddingBottom: theme.spacing(2),
                paddingLeft: theme.spacing(4),
                paddingRight: theme.spacing(7),
            },
            '& label, & h3': {
                color: theme.palette.primary.main,
                fontWeight: 'normal',
                marginTop: theme.spacing(2),
            },
            '& h3': {
                backgroundColor: theme.palette.background.darker,
                padding: theme.spacing(1, 2),
                maxWidth: '125px',
                marginTop: theme.spacing(4),
            },
            '& label ~ div': {
                display: 'flex',
                alignItems: 'center',
                padding: theme.spacing(0),
            },
        },
        subtitleContainer: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderTopColor: theme.palette.grey[400],
            margin: theme.spacing(6, 1, 2, 1),
        },
        subtitle: {
            backgroundColor: theme.palette.background.darker,
            textTransform: 'uppercase',
            fontWeight: '700 !important',
            fontSize: '0.8rem',
            padding: theme.spacing(1, 2),
            marginTop: '0px !important',
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
        apiIcon: {
            color: theme.palette.primary.main,
        },
    }),
    {
        name: 'HealthcareApplicationDetails',
    }
);

const useOverviewStyles = makeStyles(
    theme => ({
        markdown: {
            overflowY: 'scroll',
            height: '200px',
            paddingRight: theme.spacing(2),
        },
    }),
    {
        name: 'HealthcareApplicationDetailsOverview',
    }
);

const useHeaderStyles = makeStyles(
    theme => ({
        label: {
            textTransform: 'uppercase',
        },
        value: {
            fontSize: '1.25rem',
        },
        icon: {
            marginRight: theme.spacing(2),
        },
    }),
    {
        name: 'HealthcareApplicationDetailsHeader',
    }
);

const useContentStyles = makeStyles(
    theme => ({
        label: {
            fontWeight: theme.typography.fontWeightBold,
            fontSize: '1.5rem',
        },
    }),
    {
        name: 'HealthcareApplicationDetailsContent',
    }
);

const useGridStyles = makeStyles(
    theme => ({
        root: {
            borderBottom: `1px solid ${theme.palette.divider}`,
        },
    }),
    {
        name: 'HealthcareApplicationDetailsGrid',
    }
);

const useRightGridStyles = makeStyles(
    theme => ({
        root: {
            borderBottom: `1px solid ${theme.palette.divider}`,
            borderLeft: `1px solid ${theme.palette.divider}`,
        },
    }),
    {
        name: 'HealthcareApplicationDetailsRightGrid',
    }
);
