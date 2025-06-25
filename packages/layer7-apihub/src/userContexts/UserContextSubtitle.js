// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useTranslate } from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';

export const UserContextSubtitle = ({ actions, ...rest }) => {
    const { classes } = useStyles(rest);
    const translate = useTranslate();

    return (
        <Typography className={classes.root} variant="subtitle1">
            {translate('resources.userContexts.fields.userDetails.password')}
        </Typography>
    );
};

const useStyles = makeStyles({ name: 'Layer7UserContextSubtitle' })(theme => ({
    root: {
        fontWeight: theme.typography.fontWeightMedium,
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(2),
        // color: theme.palette.getContrastText(
        //     theme.palette.background.default
        // ),
    },
}));
