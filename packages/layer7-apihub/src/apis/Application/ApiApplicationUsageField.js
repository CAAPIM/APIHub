// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useGetList, useRecordContext, useTranslate } from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

/**
 * A React Admin custom field to display the number of applications using
 * the current API.
 * Meant to be used in an API view.
 */
export const ApiApplicationUsageField = props => {
    const { className, ...rest } = props;
    const translate = useTranslate();
    const { classes, cx } = useStyles(props);
    let record = useRecordContext();
    if (props.record != null) {
        record = props.record;
    }

    const { data, isLoading, error } = useGetList('applications', {
        sort: {
            field: 'name',
            order: 'ASC',
        },
        filter: {
            apiUuid: record.id,
        },
    });

    if (isLoading) {
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
            className={cx(className, classes.root)}
            {...rest}
        >
            {data && Object.keys(data).length}
        </Typography>
    );
};

const useStyles = makeStyles({ name: 'Layer7ApiApplicationUsageField' })(
    theme => ({
        root: {
            color: theme.palette.primary.main,
        },
        error: {
            color: theme.palette.error.main,
            marginBottom: theme.spacing(),
        },
    })
);
