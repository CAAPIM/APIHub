import React from 'react';
import { useTranslate } from 'react-admin';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    root: {
        fontWeight: theme.typography.fontWeightMedium,
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(2),
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
}));

export const UserContextSubtitle = ({ actions, ...rest }) => {
    const classes = useStyles(rest);
    const translate = useTranslate();

    return (
        <Typography className={classes.root} variant="subtitle1">
            {translate('resources.userContexts.fields.userDetails.password')}
        </Typography>
    );
};
