// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState, useEffect, forwardRef } from 'react';
import { useTranslate } from 'react-admin';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Fade from '@mui/material/Fade';
import LinearProgress from '@mui/material/LinearProgress';
import InputLabel from '@mui/material/InputLabel';
import Slide from '@mui/material/Slide';
import { makeStyles } from 'tss-react/mui';
import SaveIcon from '@mui/icons-material/Save';

import { ENTITY_TYPE_HOME } from '../dataProvider/documents';
import { HomePageCreateButton, HomePageEditButton } from './HomePageButton';
import { MarkdownEditor, MarkdownView } from '../ui';
import { useUserContext } from '../userContexts';
import { useMarkdownContent } from '../documentation';

/**
 * This component is responsible for fetching and displaying an home page content.
 * It also provide mechanisms for portal administrators to update it.
 *
 * The HomePageContent can be used as the default home page if there is only one content to display.
 *
 * @example <caption>Simple usage</caption>
 * <HomePageContent />
 *
 * const MyApp = props => <Admin dashboard={HomePageContent} {...props} />
 *
 */
export const HomePageContent = props => {
    const { navtitle = 'home1', entityUuid = 'home1', ...rest } = props;

    const [{ data, isLoading }, handleUpdate] = useMarkdownContent({
        entityType: ENTITY_TYPE_HOME,
        entityUuid,
        navtitle,
    });
    const translate = useTranslate();
    const { classes } = useStyles(rest);

    const [userContext] = useUserContext();
    const canEdit = userContext?.userDetails?.portalAdmin || false;

    const [mode, setMode] = useState('view');
    const handleToggleEditionMode = () => setMode('edition');
    const handleToggleViewMode = () => setMode('view');

    useEffect(() => {
        setMode('view');
    }, [data]);

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
        <div className={classes.root}>
            <MarkdownView
                className={classes.markdown}
                value={
                    !data
                        ? translate('apihub.homepage.placeholder_empty_content')
                        : data.markdown
                }
                {...rest}
            />
            {canEdit ? (
                <>
                    {data ? (
                        <HomePageEditButton onClick={handleToggleEditionMode} />
                    ) : (
                        <HomePageCreateButton
                            onClick={handleToggleEditionMode}
                        />
                    )}
                    <HomePageContentEditor
                        initialValue={data ? data.markdown : undefined}
                        navtitle={navtitle}
                        onCancel={handleToggleViewMode}
                        onSave={handleUpdate}
                        open={mode === 'edition'}
                    />
                </>
            ) : null}
        </div>
    );
};

const HomePageContentEditor = ({
    initialValue,
    onCancel,
    onSave,
    open,
    navtitle,
}) => {
    const { classes } = useHomePageContentEditorStyles();
    const [value, setValue] = useState(initialValue);
    const translate = useTranslate();

    const handleSave = () => {
        onSave(value);
    };

    const handleCancel = () => {
        setValue(initialValue);
        onCancel();
    };

    useEffect(() => {
        // Be sure the value is updated when the initialValue changed
        setValue(initialValue);
    }, [initialValue]);

    return (
        <Dialog
            open={open}
            fullScreen
            onClose={handleCancel}
            TransitionComponent={Transition}
        >
            <DialogTitle>{navtitle}</DialogTitle>
            <DialogContent>
                <InputLabel shrink htmlFor="textarea">
                    {translate('resources.documents.fields.markdown')}
                </InputLabel>
                <MarkdownEditor
                    className={classes.editor}
                    value={value}
                    onChange={setValue}
                />
            </DialogContent>
            <DialogActions className={classes.actions}>
                <Button variant="outlined" onClick={handleCancel}>
                    {translate('resources.documents.actions.cancel')}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    startIcon={<SaveIcon />}
                >
                    {translate('resources.documents.actions.save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({ name: 'Layer7HomePageContent' })(theme => ({
    root: {
        position: 'relative',
    },
    markdown: {
        overflowWrap: 'anywhere',
    },
}));

const useHomePageContentEditorStyles = makeStyles({
    name: 'Layer7HomePageContentEditor',
})(theme => ({
    editor: {
        height: `calc(100% - ${theme.spacing(2)})`,
    },
    actions: {
        margin: theme.spacing(2),
    },
}));
