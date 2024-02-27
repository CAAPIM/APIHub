import React, { useEffect, useState, useRef } from 'react';
import classnames from 'classnames';
import { useTranslate } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Fade from '@material-ui/core/Fade';
import LinearProgress from '@material-ui/core/LinearProgress';

import { useMarkdownContent } from '../documentation';
import { ApplicationDetailsOverviewEditor } from './ApplicationDetailsOverviewEditor';
import { MarkdownView } from '../ui';

export const ApplicationDetailsOverviewField = ({
    id,
    record,
    canEdit,
    ...rest
}) => {
    const classes = useStyles(rest);
    const translate = useTranslate();
    const markdownElementRef = useRef();
    const [isEditingOverview, setIsEditingOverview] = useState(false);
    const [isOverviewScrollBottom, setIsOverviewScrollBottom] = useState(false);
    const [{ data, loading }, handleUpdate] = useMarkdownContent({
        entityType: 'application',
        entityUuid: record.id,
        navtitle: 'overview',
    });

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

    const handleToggleEditing = () => {
        setIsEditingOverview(true);
    };

    const handleToggleViewing = () => {
        setIsEditingOverview(false);
    };

    if (loading) {
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
                    className={classnames(classes.overviewScrollFadeColor, {
                        [classes.overviewScrollFade]: isOverviewScrollBottom,
                        [classes.hideOverviewScrollFade]: !isOverviewScrollBottom,
                    })}
                />
            </div>
            {canEdit ? (
                <>
                    <IconButton
                        color="primary"
                        title={translate(
                            'resources.applications.notifications.edit_overview'
                        )}
                        className={classes.editButton}
                        onClick={handleToggleEditing}
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

const useStyles = makeStyles(
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
    }),
    {
        name: 'Layer7ApplicationOverviewField',
    }
);
