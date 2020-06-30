import React from 'react';
import classnames from 'classnames';
import { useTranslate } from 'ra-core';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

export const HomePageCreateButton = ({ onClick, className, ...rest }) => {
    const translate = useTranslate();
    const classes = useStyles(rest);

    return (
        <Tooltip title={translate('ra.action.create')}>
            <Fab
                aria-label={translate('ra.action.create')}
                className={classnames(classes.root, className)}
                onClick={onClick}
            >
                <AddIcon />
            </Fab>
        </Tooltip>
    );
};

export const HomePageEditButton = ({ onClick, className, ...rest }) => {
    const translate = useTranslate();
    const classes = useStyles(rest);

    return (
        <Tooltip title={translate('ra.action.edit')}>
            <Fab
                aria-label={translate('ra.action.edit')}
                className={classnames(classes.root, className)}
                onClick={onClick}
            >
                <EditIcon />
            </Fab>
        </Tooltip>
    );
};

const useStyles = makeStyles(
    theme => {
        const appBarHeight = theme.spacing(9); // AppBar (size + margin)
        const homePagePadding = theme.spacing(3); // HomePage (padding)

        return {
            root: {
                position: 'fixed',
                right: homePagePadding,
                top: `calc(${appBarHeight}px + ${homePagePadding}px)`,
            },
        };
    },
    {
        name: 'Layer7HomePageButton',
    }
);
