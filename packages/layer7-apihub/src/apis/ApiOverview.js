// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import {
    Labeled,
    TextField,
    DateField,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'tss-react/mui';

import { MarkdownField, LinkField } from '../ui';
import { VisibilityField } from './VisibilityField';
import { ApiAssetsField } from './ApiAssetsField';
import { ApiApplicationUsageField } from './Application';
import { AsyncTagsField } from './TagsField';
import { ApiStatus } from './ApiStatus';

export const ApiOverview = ({ userIsPublisher }) => {
    const { classes, cx } = useOverviewStyles();
    const { classes: gridClasses } = useGridStyles();
    const { classes: rightGridClasses } = useRightGridStyles();
    const { classes: headerLabelClasses } = useHeaderStyles();
    const { classes: contentLabelClasses } = useContentStyles();
    const translate = useTranslate();
    const record = useRecordContext();

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
                        // On <Labeled />, this will translate in a correct `for` attribute on the label
                        id="portalStatus"
                        label="resources.apis.fields.portalStatus"
                        classes={headerLabelClasses}
                        className={classes.field}
                    >
                        <ApiStatus />
                    </Labeled>
                </Grid>
                <Grid item>
                    <Labeled
                        // On <Labeled />, this will translate in a correct `for` attribute on the label
                        id="apiServiceType"
                        label="resources.apis.fields.apiServiceType"
                        classes={headerLabelClasses}
                        className={classes.field}
                    >
                        <TextField
                            id="apiServiceType"
                            source="apiServiceType"
                            className={cx(
                                headerLabelClasses.value,
                                classes.type
                            )}
                        />
                    </Labeled>
                </Grid>
                <Grid item>
                    <Labeled
                        // On <Labeled />, this will translate in a correct `for` attribute on the label
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
                        // On <Labeled />, this will translate in a correct `for` attribute on the label
                        id="accessStatus"
                        label="resources.apis.fields.accessStatus"
                        classes={headerLabelClasses}
                        className={classes.field}
                    >
                        <VisibilityField
                            id="accessStatus"
                            source="accessStatus"
                            className={headerLabelClasses.value}
                        />
                    </Labeled>
                </Grid>
                <Grid item>
                    <Labeled
                        // On <Labeled />, this will translate in a correct `for` attribute on the label
                        id="modifyTs"
                        label="resources.apis.fields.modifyTs"
                        classes={headerLabelClasses}
                        className={classes.field}
                    >
                        <DateField
                            id="modifyTs"
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
                        // On <Labeled />, this will translate in a correct `for` attribute on the label
                        id="applicationUsage"
                        label="resources.apis.fields.applicationUsage"
                        classes={headerLabelClasses}
                        className={classes.field}
                    >
                        <ApiApplicationUsageField
                            id="applicationUsage"
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
                {userIsPublisher && (
                    <Grid item>
                        <Labeled
                            // On <Labeled />, this will translate in a correct `for` attribute on the label
                            id="apiLocation"
                            label="resources.apis.fields.apiLocation"
                            classes={contentLabelClasses}
                            className={classes.field}
                        >
                            <LinkField
                                id="locationUrl"
                                source="locationUrl"
                                target="_blank"
                                rel="noopener"
                            />
                        </Labeled>
                    </Grid>
                )}

                <Grid item>
                    <Labeled
                        // On <Labeled />, this will translate in a correct `for` attribute on the label
                        id="description"
                        label="resources.apis.fields.description"
                        classes={contentLabelClasses}
                        className={classes.field}
                    >
                        <MarkdownField id="description" source="description" />
                    </Labeled>
                </Grid>
                {userIsPublisher ? (
                    <Grid item>
                        <Labeled
                            // On <Labeled />, this will translate in a correct `for` attribute on the label
                            id="privateDescription"
                            label="resources.apis.fields.privateDescription"
                            classes={contentLabelClasses}
                            className={classes.field}
                        >
                            <MarkdownField
                                id="privateDescription"
                                source="privateDescription"
                            />
                        </Labeled>
                    </Grid>
                ) : null}
                <Grid item>
                    <Labeled
                        // On <Labeled />, this will translate in a correct `for` attribute on the label
                        id="tags"
                        label="resources.apis.fields.tags"
                        classes={contentLabelClasses}
                        className={classes.field}
                    >
                        <Grid item container alignItems="center">
                            <AsyncTagsField id="tags" />
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
                    // On <Labeled />, this will translate in a correct `for` attribute on the label
                    id="assets"
                    label="resources.apis.fields.assets"
                    classes={contentLabelClasses}
                    className={classes.field}
                >
                    <ApiAssetsField id="assets" />
                </Labeled>
            </Grid>
        </Grid>
    );
};

const useOverviewStyles = makeStyles({ name: 'Layer7ApiOverview' })(theme => ({
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
}));

const useHeaderStyles = makeStyles()(theme => ({
    label: {
        textTransform: 'uppercase',
    },
    value: {
        fontWeight: theme.typography.fontWeightBold,
    },
}));

const useContentStyles = makeStyles()(theme => ({
    label: {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.5rem',
    },
}));

const useGridStyles = makeStyles()(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
}));

const useRightGridStyles = makeStyles()(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        borderLeft: `1px solid ${theme.palette.divider}`,
    },
}));
