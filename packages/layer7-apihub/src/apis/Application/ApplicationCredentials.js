import React from 'react';
import { useTranslate, useGetOne } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    root: {
        border: `solid 1px ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
    },
    mainKey: {
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightBold,
        wordBreak: 'break-all',
    },
    secondaryKey: {
        color: theme.palette.text.primary,
        wordBreak: 'break-all',
    },
    label: {
        marginRight: theme.spacing(1),
    },
}));

export const ApplicationCredentials = ({ id }) => {
    const classes = useStyles();
    const translate = useTranslate();

    const { data, loaded, error } = useGetOne('applications', id);

    if (!loaded) {
        return <CircularProgress color="primary" />;
    }

    if (!data || error) {
        return (
            <Typography variant="body2" color="error">
                {translate('ra.page.error')}
            </Typography>
        );
    }

    const { apiKey, keySecret } = data;

    return (
        <div className={classes.root}>
            <Typography variant="subtitle1" className={classes.mainKey}>
                <span className={classes.label}>
                    {translate('resources.applications.fields.apiKey')}
                </span>
                {apiKey}
            </Typography>
            <Typography variant="body2" className={classes.secondaryKey}>
                <span className={classes.label}>
                    {translate('resources.applications.fields.keySecret')}
                </span>
                {keySecret}
            </Typography>
        </div>
    );
};
