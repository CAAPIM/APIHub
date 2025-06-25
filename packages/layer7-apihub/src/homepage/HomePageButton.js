// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useTranslate } from 'react-admin';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import { makeStyles } from 'tss-react/mui';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

export const HomePageCreateButton = ({ onClick, className, ...rest }) => {
    const translate = useTranslate();
    const { classes, cx } = useStyles(rest);

    return (
        <Tooltip title={translate('ra.action.create')}>
            <Fab
                aria-label={translate('ra.action.create')}
                className={cx(classes.root, className)}
                onClick={onClick}
            >
                <AddIcon />
            </Fab>
        </Tooltip>
    );
};

export const HomePageEditButton = ({ onClick, className, ...props }) => {
    const translate = useTranslate();
    const { classes, cx } = useStyles(props);

    return (
        <Tooltip title={translate('ra.action.edit')}>
            <Fab
                aria-label={translate('ra.action.edit')}
                className={cx(classes.root, className)}
                onClick={onClick}
            >
                <EditIcon />
            </Fab>
        </Tooltip>
    );
};

const useStyles = makeStyles({ name: 'Layer7HomePageButton' })(theme => {
    const homePagePadding = theme.spacing(3); // HomePage (padding)

    return {
        root: {
            position: 'fixed',
            right: homePagePadding,
            top: '90px',
        },
    };
});
