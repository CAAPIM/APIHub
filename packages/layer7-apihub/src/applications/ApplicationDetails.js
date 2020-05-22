import React, { useEffect, useState, useRef } from 'react';
import { Labeled, TextField, useNotify } from 'react-admin';
import { useTranslate } from 'ra-core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import IconFileCopy from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import Fade from '@material-ui/core/Fade';
import LinearProgress from '@material-ui/core/LinearProgress';
import get from 'lodash/get';

import { useUserContext } from '../userContexts';
import { useMarkdownContent } from '../documentation';
import { ApplicationDetailsOverviewEditor } from './ApplicationDetailsOverviewEditor';
import { ApplicationApisList } from './ApplicationApisList';
import { KeySecret } from './KeySecret';
import { MarkdownView } from '../ui';

const useAppDetailsStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        fontFamily: theme.typography.body2.fontFamily,
        fontSize: theme.typography.caption.fontSize,
        margin: theme.spacing(0),
    },
    field: {
        margin: theme.spacing(0, 1, 2, 1),
        minWidth: '200px',
        width: '100%',
    },
    type: {
        textTransform: 'uppercase',
    },
    apiKeySection: {
        borderTop: `20px solid ${theme.palette.background.default}`,
        paddingTop: '20px',
    },
    overview: {
        display: 'flex',
        alignItems: 'baseline',
        marginBottom: '-40px',
        width: '100%',
    },
    overviewMarkdown: {
        width: '100%',
    },
    editOverview: {
        marginLeft: theme.spacing(),
    },
    overviewScrollFade: {
        position: 'relative',
        top: '-40px',
        height: '40px',
        background:
            'linear-gradient(to bottom, rgba(251, 251, 251, 0) 0%, rgba(251, 251, 251, 1) 100%)',
        width: 'cacl(100% - 10px)',
    },
    hideOverviewScrollFade: {
        position: 'relative',
        top: '-40px',
        height: '40px',
        opacity: 0,
        transition: 'opacity 2s',
    },
    markdown: {
        overflowY: 'scroll',
        height: '200px',
        paddingRight: theme.spacing(2),
    },
    icon: {
        fontSize: '1rem',
    },
}));

const useHeaderStyles = makeStyles(theme => ({
    label: {
        textTransform: 'uppercase',
        fontWeight: theme.typography.fontWeightBold,
        marginLeft: theme.spacing(1),
    },
    value: {
        textTransform: 'uppercase',
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1rem',
        margin: theme.spacing(1, 1, 2, 1),
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
        borderBottom: `10px solid ${theme.palette.background.default}`,
    },
}));

const useRightGridStyles = makeStyles(theme => ({
    root: {
        borderBottom: `10px solid ${theme.palette.background.default}`,
        borderLeft: `10px solid ${theme.palette.background.default}`,
    },
}));

export const useCopyToClipboard = () => {
    const notify = useNotify();

    async function copyToClipboard(event) {
        if (!navigator || !navigator.clipboard) {
            // Error message 'Copy to clipboard not supported'
            return;
        }
        const textToCopy = get(event, 'currentTarget.value', '');
        try {
            await navigator.clipboard.writeText(textToCopy);
            notify('resources.applications.notifications.copy_success');
            // Success message 'Copied to clipboard!'
        } catch (err) {
            notify('resources.applications.notifications.copy_error');
        }
    }

    return copyToClipboard;
};

export const ApplicationDetails = ({ record }) => {
    const classes = useAppDetailsStyles();
    const gridClasses = useGridStyles();
    const rightGridClasses = useRightGridStyles();
    const headerLabelClasses = useHeaderStyles();
    const contentLabelClasses = useContentStyles();
    const translate = useTranslate();
    const copyToClipboard = useCopyToClipboard();
    const markdownElementRef = useRef();
    const [isEditingOverview, setIsEditingOverview] = useState(false);
    const [isOverviewScrollBottom, setIsOverviewScrollBottom] = useState(false);

    const [{ data, loaded, loading }, handleUpdate] = useMarkdownContent({
        entityType: 'application',
        entityUuid: record.id,
        navtitle: 'overview',
    });

    const apiIds = (record.apiIds && record.apiIds.results) || [];

    const [userContext] = useUserContext();
    const canEdit = userContext?.userDetails?.portalAdmin || false;

    const handleToggleEditing = () => {
        setIsEditingOverview(true);
    };

    const handleToggleViewing = () => {
        setIsEditingOverview(false);
    };

    const handleOverviewScroll = event => {
        const { target } = event;

        setIsOverviewScrollBottom(
            !(
                target.scrollHeight - target.scrollTop <=
                target.clientHeight + 20
            )
        );
    };

    useEffect(() => {
        if (!data || data.markdown == null || data.markdown === '') {
            setIsOverviewScrollBottom(false);
            return;
        }
        setTimeout(() => {
            setIsOverviewScrollBottom(
                markdownElementRef.current.scrollHeight >
                    markdownElementRef.current.clientHeight + 20
            );
        }, 100);
    }, [data]);

    useEffect(() => {
        handleToggleViewing();
    }, [data]);

    if (!loaded) {
        return (
            <Fade
                in
                style={{
                    transitionDelay: '300ms',
                }}
                unmountOnExit
            >
                <LinearProgress />
            </Fade>
        );
    }

    return (
        <>
            <Grid className={classes.root} container spacing={3}>
                <Grid
                    container
                    item
                    md={6}
                    sm={12}
                    direction="column"
                    classes={gridClasses}
                >
                    <Grid
                        item
                        container
                        direction="column"
                        className={useAppDetailsStyles.apiKeySection}
                    >
                        <Grid item>
                            <Labeled
                                label="resources.applications.fields.overview"
                                classes={contentLabelClasses}
                                className={classes.field}
                            >
                                <div className={classes.overview}>
                                    <div className={classes.overviewMarkdown}>
                                        <MarkdownView
                                            ref={markdownElementRef}
                                            className={classes.markdown}
                                            onScroll={handleOverviewScroll}
                                            value={
                                                data &&
                                                data.markdown != null &&
                                                data.markdown !== ''
                                                    ? data.markdown
                                                    : translate(
                                                          'resources.applications.notifications.empty_overview'
                                                      )
                                            }
                                        />
                                        <div
                                            className={
                                                isOverviewScrollBottom
                                                    ? classes.overviewScrollFade
                                                    : classes.hideOverviewScrollFade
                                            }
                                        />
                                    </div>
                                    {canEdit ? (
                                        <>
                                            <IconButton
                                                color="primary"
                                                title={translate(
                                                    'resources.applications.notifications.edit_overview'
                                                )}
                                                className={classes.editOverview}
                                                onClick={handleToggleEditing}
                                            >
                                                <EditIcon
                                                    className={classes.icon}
                                                />
                                            </IconButton>
                                            <ApplicationDetailsOverviewEditor
                                                initialValue={
                                                    data
                                                        ? data.markdown
                                                        : undefined
                                                }
                                                onCancel={handleToggleViewing}
                                                onSave={handleUpdate}
                                                open={isEditingOverview}
                                            />
                                        </>
                                    ) : null}
                                </div>
                            </Labeled>
                        </Grid>
                        <Grid item>
                            <Labeled
                                label="resources.applications.fields.apiKeyClientID"
                                classes={contentLabelClasses}
                                className={classes.field}
                            >
                                <Typography variant="body2">
                                    {record.apiKey}
                                    <IconButton
                                        color="primary"
                                        title={translate(
                                            'resources.applications.notifications.copy_to_clipboard'
                                        )}
                                        value={record.apiKey}
                                        onClick={copyToClipboard}
                                    >
                                        <IconFileCopy
                                            className={classes.icon}
                                        />
                                    </IconButton>
                                </Typography>
                            </Labeled>
                        </Grid>
                        {record.keySecret && (
                            <Grid item>
                                <KeySecret id={record.id} record={record} />
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    md={6}
                    sm={12}
                    direction="column"
                    classes={rightGridClasses}
                    justify="flex-start"
                >
                    <Grid item>
                        <Labeled
                            label="resources.applications.fields.description"
                            classes={contentLabelClasses}
                            className={classes.field}
                        >
                            <TextField record={record} source="description" />
                        </Labeled>
                    </Grid>
                    <Grid item>
                        <Typography
                            variant="h3"
                            className={headerLabelClasses.value}
                        >
                            {translate(
                                'resources.applications.notifications.configuration'
                            )}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Labeled
                            label="resources.applications.fields.oauthCallbackUrl"
                            classes={contentLabelClasses}
                            className={classes.field}
                        >
                            <TextField
                                record={record}
                                source="OauthCallbackUrl"
                            />
                        </Labeled>
                    </Grid>
                    <Grid item>
                        <Labeled
                            label="resources.applications.fields.oauthScope"
                            classes={contentLabelClasses}
                            className={classes.field}
                        >
                            <TextField record={record} source="OauthScope" />
                        </Labeled>
                    </Grid>
                    <Grid item>
                        <Labeled
                            label="resources.applications.fields.oauthType"
                            classes={contentLabelClasses}
                            className={classes.field}
                        >
                            <TextField record={record} source="OauthType" />
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
