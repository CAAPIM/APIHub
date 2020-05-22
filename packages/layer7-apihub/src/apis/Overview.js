import React from 'react';
import classNames from 'classnames';
import { Labeled, TextField, DateField } from 'react-admin';
import { useTranslate } from 'ra-core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { MarkdownField, LinkField } from '../ui';
import { VisibilityField } from './VisibilityField';
import { ApiAssetsField } from './ApiAssetsField';
import { ApplicationUsageField } from './Application';
import { AsyncTagsField } from './TagsField';

const useOverviewStyles = makeStyles(
    theme => ({
        root: {
            display: 'flex',
            fontFamily: theme.typography.body2.fontFamily,
            fontSize: theme.typography.caption.fontSize,
            margin: -theme.spacing(1),
        },
        enabledContainer: {
            width: 'auto',
        },
        enabled: {
            color: theme.palette.success.main,
            '& $enabledIcon': {
                backgroundColor: theme.palette.success.main,
            },
        },
        disabled: {
            '& $enabledIcon': {
                backgroundColor: theme.palette.text.disabled,
            },
        },
        enabledIcon: {
            width: theme.spacing(1.5),
            height: theme.spacing(1.5),
            borderRadius: 99999,
            marginRight: theme.spacing(),
        },
        field: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            minWidth: '100px',
        },
        type: {
            textTransform: 'uppercase',
        },
        informations: {},
        applications: {},
        description: {},
        assets: {},
    }),
    { name: 'Layer7ApiOverview' }
);

const useHeaderStyles = makeStyles(theme => ({
    label: {
        textTransform: 'uppercase',
    },
    value: {
        fontWeight: theme.typography.fontWeightBold,
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

export const Overview = ({ record, userIsPublisher }) => {
    const classes = useOverviewStyles();
    const gridClasses = useGridStyles();
    const rightGridClasses = useRightGridStyles();
    const headerLabelClasses = useHeaderStyles();
    const contentLabelClasses = useContentStyles();
    const translate = useTranslate();

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
                <Grid item>
                    <Labeled
                        // on Labeled, this will translate in a correct `for` attribute on the label
                        id="portalStatus"
                        label="resources.apis.fields.portalStatus"
                        classes={headerLabelClasses}
                        className={classes.field}
                    >
                        <Grid
                            item
                            container
                            alignItems="center"
                            className={classNames(classes.enabledContainer, {
                                [classes.enabled]:
                                    record.portalStatus === 'ENABLED',
                                [classes.disabled]:
                                    record.portalStatus !== 'ENABLED',
                            })}
                        >
                            <div className={classes.enabledIcon} />
                            <Typography
                                variant="body2"
                                className={headerLabelClasses.value}
                                id="portalStatus"
                            >
                                {translate(
                                    `resources.apis.portalStatus.${record.portalStatus.toLowerCase()}`
                                )}
                            </Typography>
                        </Grid>
                    </Labeled>
                </Grid>
                <Grid item>
                    <Labeled
                        // on Labeled, this will translate in a correct `for` attribute on the label
                        id="apiServiceType"
                        label="resources.apis.fields.apiServiceType"
                        classes={headerLabelClasses}
                        className={classes.field}
                    >
                        <TextField
                            id="apiServiceType"
                            record={record}
                            source="apiServiceType"
                            className={classNames(
                                headerLabelClasses.value,
                                classes.type
                            )}
                        />
                    </Labeled>
                </Grid>
                <Grid item>
                    <Labeled
                        // on Labeled, this will translate in a correct `for` attribute on the label
                        id="version"
                        label="resources.apis.fields.version"
                        classes={headerLabelClasses}
                        className={classes.field}
                    >
                        <Typography
                            id="version"
                            variant="body2"
                            className={headerLabelClasses.value}
                        >
                            {translate(
                                'resources.apis.overview.fields.version',
                                {
                                    version: record.version,
                                }
                            )}
                        </Typography>
                    </Labeled>
                </Grid>
                <Grid item>
                    <Labeled
                        // on Labeled, this will translate in a correct `for` attribute on the label
                        id="accessStatus"
                        label="resources.apis.fields.accessStatus"
                        classes={headerLabelClasses}
                        className={classes.field}
                    >
                        <VisibilityField
                            id="accessStatus"
                            record={record}
                            source="accessStatus"
                            className={headerLabelClasses.value}
                        />
                    </Labeled>
                </Grid>
                <Grid item>
                    <Labeled
                        // on Labeled, this will translate in a correct `for` attribute on the label
                        id="modifyTs"
                        label="resources.apis.fields.modifyTs"
                        classes={headerLabelClasses}
                        className={classes.field}
                    >
                        <DateField
                            id="modifyTs"
                            record={record}
                            source="modifyTs"
                            className={headerLabelClasses.value}
                        />
                    </Labeled>
                </Grid>
            </Grid>
            <Grid
                className={classes.applications}
                container
                item
                md={4}
                sm={12}
                classes={rightGridClasses}
            >
                <Grid item>
                    <Labeled
                        // on Labeled, this will translate in a correct `for` attribute on the label
                        id="applicationUsage"
                        label="resources.apis.fields.applicationUsage"
                        classes={headerLabelClasses}
                        className={classes.field}
                    >
                        <ApplicationUsageField
                            id="applicationUsage"
                            record={record}
                            className={headerLabelClasses.value}
                        />
                    </Labeled>
                </Grid>
            </Grid>
            <Grid
                container
                item
                md={8}
                sm={12}
                direction="column"
                className={classes.description}
                classes={gridClasses}
            >
                {userIsPublisher ? (
                    <Grid item>
                        <Labeled
                            // on Labeled, this will translate in a correct `for` attribute on the label
                            id="apiLocation"
                            label="resources.apis.fields.apiLocation"
                            classes={contentLabelClasses}
                            className={classes.field}
                        >
                            <LinkField
                                id="locationUrl"
                                record={record}
                                source="locationUrl"
                                target="_blank"
                                rel="noopener"
                            />
                        </Labeled>
                    </Grid>
                ) : null}

                <Grid item>
                    <Labeled
                        // on Labeled, this will translate in a correct `for` attribute on the label
                        id="description"
                        label="resources.apis.fields.description"
                        classes={contentLabelClasses}
                        className={classes.field}
                    >
                        <MarkdownField
                            id="description"
                            record={record}
                            source="description"
                        />
                    </Labeled>
                </Grid>
                {userIsPublisher ? (
                    <Grid item>
                        <Labeled
                            // on Labeled, this will translate in a correct `for` attribute on the label
                            id="privateDescription"
                            label="resources.apis.fields.privateDescription"
                            classes={contentLabelClasses}
                            className={classes.field}
                        >
                            <MarkdownField
                                id="privateDescription"
                                record={record}
                                source="privateDescription"
                            />
                        </Labeled>
                    </Grid>
                ) : null}
                <Grid item>
                    <Labeled
                        // on Labeled, this will translate in a correct `for` attribute on the label
                        id="tags"
                        label="resources.apis.fields.tags"
                        classes={contentLabelClasses}
                        className={classes.field}
                    >
                        <Grid item container alignItems="center">
                            <AsyncTagsField id="tags" record={record} />
                        </Grid>
                    </Labeled>
                </Grid>
            </Grid>
            <Grid
                container
                item
                md={4}
                sm={12}
                className={classes.assets}
                classes={rightGridClasses}
            >
                <Labeled
                    // on Labeled, this will translate in a correct `for` attribute on the label
                    id="assets"
                    label="resources.apis.fields.assets"
                    classes={contentLabelClasses}
                    className={classes.field}
                >
                    <ApiAssetsField id="assets" record={record} />
                </Labeled>
            </Grid>
        </Grid>
    );
};
