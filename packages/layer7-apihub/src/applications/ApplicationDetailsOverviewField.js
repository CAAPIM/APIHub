// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useEffect, useState, useRef } from 'react';
import { useGetRecordId, useTranslate } from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Fade from '@mui/material/Fade';
import LinearProgress from '@mui/material/LinearProgress';
import { get } from 'lodash';

import { useMarkdownContent } from '../documentation';
import { ApplicationDetailsOverviewEditor } from './ApplicationDetailsOverviewEditor';
import { MarkdownView } from '../ui';

export const ApplicationDetailsOverviewField = ({ id, canEdit, ...rest }) => {
    const { classes, cx } = useStyles(rest);
    const translate = useTranslate();
    const markdownElementRef = useRef();
    const [isEditingOverview, setIsEditingOverview] = useState(false);
    const [isOverviewScrollBottom, setIsOverviewScrollBottom] = useState(false);
    const recordId = useGetRecordId();
    const [{ data, isLoading }, handleUpdate] = useMarkdownContent({
        entityType: 'application',
        entityUuid: recordId,
        navtitle: 'overview',
    });

    const handleOverviewScroll = event => {
        const { target } = event;
        const scrollHeight = get(target, 'scrollHeight');
        const scrollTop = get(target, 'scrollTop');
        const clientHeight = get(target, 'clientHeight');

        setIsOverviewScrollBottom(
            !(scrollHeight - scrollTop <= clientHeight + 20)
        );
    };

    useEffect(() => {
        if (!data || data.markdown == null || data.markdown === '') {
            setIsOverviewScrollBottom(false);
            return;
        }
        setTimeout(() => {
            const scrollHeight = get(
                markdownElementRef,
                'current.scrollHeight'
            );
            const clientHeight = get(
                markdownElementRef,
                'current.clientHeight'
            );
            setIsOverviewScrollBottom(scrollHeight > clientHeight + 20);
        }, 100);
    }, [data]);

    useEffect(() => {
        handleToggleViewing();
    }, [data]);

    const handleToggleEditing = () => {
        setIsEditingOverview(true);
    };

    const handleToggleViewing = () => {
        setIsEditingOverview(false);
    };

    if (isLoading) {
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
        <div className={classes.overview}>
            <div className={classes.overviewMarkdown}>
                <MarkdownView
                    id={id}
                    ref={markdownElementRef}
                    className={classes.markdown}
                    onScroll={handleOverviewScroll}
                    value={
                        data && data.markdown != null && data.markdown !== ''
                            ? data.markdown
                            : translate(
                                  'resources.applications.notifications.empty_overview'
                              )
                    }
                />
                <div
                    className={cx(classes.overviewScrollFadeColor, {
                        [classes.overviewScrollFade]: isOverviewScrollBottom,
                        [classes.hideOverviewScrollFade]:
                            !isOverviewScrollBottom,
                    })}
                />
            </div>
            {canEdit ? (
                <>
                    <IconButton
                        title={translate(
                            'resources.applications.notifications.edit_overview'
                        )}
                        className={classes.editButton}
                        onClick={handleToggleEditing}
                        size="large"
                    >
                        <EditIcon className={classes.icon} />
                    </IconButton>
                    <ApplicationDetailsOverviewEditor
                        initialValue={data ? data.markdown : ''}
                        onCancel={handleToggleViewing}
                        onSave={handleUpdate}
                        open={isEditingOverview}
                    />
                </>
            ) : null}
        </div>
    );
};

const useStyles = makeStyles({ name: 'Layer7ApplicationOverviewField' })(
    theme => ({
        overview: {
            display: 'flex',
            alignItems: 'baseline',
            marginBottom: '-40px',
            width: '100%',
        },
        overviewMarkdown: {
            width: '100%',
            overflowWrap: 'anywhere',
        },
        markdown: {
            overflowY: 'scroll',
            height: '200px',
        },
        editButton: {
            marginLeft: theme.spacing(),
        },
        overviewScrollFade: {
            position: 'relative',
            top: '-40px',
            height: '40px',
            width: `calc(100% - ${theme.spacing(2)})`,
        },
        hideOverviewScrollFade: {
            position: 'relative',
            top: '-40px',
            height: '40px',
            opacity: 0,
            transition: 'opacity 2s',
        },
        overviewScrollFadeColor: {
            pointerEvents: 'none',
            background:
                'linear-gradient(to bottom, rgba(251, 251, 251, 0) 0%, rgba(251, 251, 251, 1) 100%)',
        },
        icon: {
            fontSize: '1rem',
        },
    })
);
