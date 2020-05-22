import React, { cloneElement } from 'react';
import { useTranslate } from 'react-admin';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export const UserContextTitle = ({
    actions,
    basePath,
    resource,
    record,
    ...rest
}) => {
    const translate = useTranslate();
    const classes = useStyles(rest);

    return (
        <div className={classes.root}>
            {translate('resources.userContexts.title')}
            {actions &&
                cloneElement(actions, {
                    basePath,
                    resource,
                    record,
                })}
        </div>
    );
};
