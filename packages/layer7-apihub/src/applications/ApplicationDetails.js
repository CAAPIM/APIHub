import React from 'react';
import { Labeled, TextField } from 'react-admin';
import { useDataProvider, useTranslate } from 'ra-core';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import sortBy from 'lodash/sortBy';

import { useUserContext } from '../userContexts';
import { ApplicationApisList } from './ApplicationApisList';
import { ApplicationDetailsOverviewField } from './ApplicationDetailsOverviewField';
import { ApplicationDetailsKeyClient } from './ApplicationDetailsKeyClient';
import { isApplicationPendingOrDisabled } from './isApplicationPending';
import { isPublisher, isOrgAdmin, isOrgBoundUser } from '../userContexts';
import { useLayer7Notify } from '../useLayer7Notify';

export const ApplicationDetails = ({ record }) => {
    const classes = useStyles();
    const gridClasses = useGridStyles();
    const contentLabelClasses = useContentStyles();
    const applicationDetailsOverviewClasses = useApplicationDetailsOverviewStyles();
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const notify = useLayer7Notify();

    const apiIds = (record.apiIds && record.apiIds.results) || [];

    const [userContext] = useUserContext();
    const canEdit = isPublisher(userContext) || isOrgAdmin(userContext);
    const isEditDisabled = isEditApplicationDisabled(userContext, record);
    const isOrgUser = isOrgBoundUser(userContext);

    const [apiKeys, setApiKeys] = React.useState([]);

    React.useEffect(() => {
        const fetchApiKeys = async () => {
            const { data } = await dataProvider.getList(
                'apiKeys',
                {
                    applicationUuid: record.id,
                    pagination: { page: 1, perPage: 100 },
                    sort: { field: 'createTs', order: 'DESC' },
                },
                {
                    onFailure: error => notify(error),
                }
            );
            setApiKeys(sortBy(data, ({ defaultKey }) => !defaultKey));
        };
        fetchApiKeys();
    }, []);

    return (
        <>
            <Grid className={classes.root} container spacing={3}>
                <Grid
                    container
                    item
                    md={12}
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
                        {record.description && (
                            <Labeled
                                // On <Labeled />, this will translate in a correct `for` attribute on the label
                                label="resources.applications.fields.description"
                                classes={contentLabelClasses}
                                className={classes.mainField}
                            >
                                <Typography
                                    variant="body2"
                                    className={classes.fieldContent}
                                >
                                    <span id="description">
                                        {record.description}
                                    </span>
                                </Typography>
                            </Labeled>
                        )}
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
                                    key={item.Name}
                                    classes={classes}
                                    className={classes.field}
                                >
                                    <div className={classes.fieldValue}>
                                        <TextField
                                            record={item}
                                            source="Value"
                                        />
                                    </div>
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
                    md={12}
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
                        </Typography>
                    </Grid>
                    <Divider />
                    <List className={classes.mainField}>
                        {apiKeys.map(apiKey => (
                            <ApplicationDetailsKeyClient
                                id={apiKey.id}
                                key={apiKey.id}
                                data={apiKey}
                                includeSecret={true}
                                labelClasses={contentLabelClasses}
                            />
                        ))}
                    </List>
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
            width: '100%',
        },
        details: {
            padding: `${theme.spacing(1)}px ${theme.spacing(3)}px !important`,
        },
        configuration: {
            padding: `${theme.spacing(1)}px ${theme.spacing(3)}px !important`,
        },
        subtitle: {
            fontWeight: theme.typography.fontWeightBold,
            fontSize: '21px',
            lineHeight: '22px',
            margin: theme.spacing(1, 0, 1, 0),
        },
        field: {
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(1),
            minWidth: '100px',
            width: '100%',
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
        mainField: {
            minWidth: '100px',
            padding: 0,
            width: '100%',
        },
        fieldValue: {
            color: theme.palette.primary.textHub || '#333333',
            fontFamily: theme.typography.textHub,
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: 'normal',
            lineHeight: '20px',
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
        color: theme.palette.primary.textHub || '#333333',
        fontFamily: theme.typography.textHub,
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '21px',
        lineHeight: '22px',
        margin: theme.spacing(1, 0, 1, 0),
        transform: 'unset',
    },
}));

const useGridStyles = makeStyles(theme => ({
    root: {
        borderBottom: 'none',
    },
}));
