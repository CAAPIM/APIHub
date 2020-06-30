import React from 'react';
import { useTranslate } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

const useTitleStyles = makeStyles(
    theme => ({
        root: {},
        title: {},
        divider: {
            marginTop: theme.spacing(2),
            backgroundColor: theme.palette.grey[300],
        },
    }),
    {
        name: 'HealthcareDocumentTitle',
    }
);

export const DocumentTitle = props => {
    const classes = useTitleStyles(props);
    const translate = useTranslate();

    return (
        <div className={classes.root}>
            <span className={classes.title}>
                {translate(`resources.documents.name`, {
                    smart_count: 2,
                })}
            </span>
            <Divider className={classes.divider} />
        </div>
    );
};
