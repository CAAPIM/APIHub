import React from 'react';
import classNames from 'classnames';
import { useGetList } from 'react-admin';
import { useTranslate } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

/**
 * A React Admin custom field to display the number of applications using
 * the current API.
 * Meant to be used in an API view.
 */
export const ApiApplicationUsageField = props => {
    const { className, record, ...rest } = props;
    const translate = useTranslate();
    const classes = useStyles(props);

    const { data, loaded, error } = useGetList(
        'applications',
        undefined,
        { field: 'name', order: 'ASC' },
        {
            apiUuid: record.id,
        }
    );

    if (!loaded) {
        return <LinearProgress />;
    }

    if (!data || error) {
        return (
            <Typography variant="body2" className={classes.error} {...rest}>
                {translate('ra.page.error')}
            </Typography>
        );
    }

    return (
        <Typography
            variant="body2"
            className={classNames(className, classes.root)}
            {...rest}
        >
            {data && Object.keys(data).length}
        </Typography>
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {
            color: theme.palette.primary.main,
        },
        error: {
            color: theme.palette.error.main,
            marginBottom: theme.spacing(),
        },
    }),
    {
        name: 'Layer7ApiApplicationUsageField',
    }
);
