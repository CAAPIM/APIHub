import React, { useState, useEffect, forwardRef } from 'react';
import { useTranslate } from 'ra-core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fade from '@material-ui/core/Fade';
import LinearProgress from '@material-ui/core/LinearProgress';
import InputLabel from '@material-ui/core/InputLabel';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';

import { ENTITY_TYPE_HOME } from '../dataProvider/documents';
import { HomePageCreateButton, HomePageEditButton } from './HomePageButton';
import {
    MarkdownEditor,
    MarkdownView,
} from '../ui';
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

    const [{ data, loading }, handleUpdate] = useMarkdownContent({
        entityType: ENTITY_TYPE_HOME,
        entityUuid,
        navtitle,
    });
    const translate = useTranslate();
    const classes = useStyles(rest);

    const [userContext] = useUserContext();
    const canEdit = userContext?.userDetails?.portalAdmin || false;

    const [mode, setMode] = useState('view');
    const handleToggleEditionMode = () => setMode('edition');
    const handleToggleViewMode = () => setMode('view');

    useEffect(() => {
        setMode('view');
    }, [data]);

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
    const classes = useHomePageContentEditorStyles();
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
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleCancel}
                >
                    {translate('resources.documents.actions.cancel')}
                </Button>
                <Button
                    color="primary"
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

const useStyles = makeStyles(
    theme => ({
        root: {
            position: 'relative',
        },
        markdown: {
            overflowWrap: 'anywhere',
        },
    }),
    {
        name: 'Layer7HomePageContent',
    }
);

const useHomePageContentEditorStyles = makeStyles(
    theme => ({
        editor: {
            height: `calc(100% - ${theme.spacing(2)}px)`,
        },
        actions: {
            margin: theme.spacing(2),
        },
    }),
    {
        name: 'Layer7HomePageContentEditor',
    }
);
