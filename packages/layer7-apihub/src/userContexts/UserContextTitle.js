// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { cloneElement } from 'react';
import { useTranslate } from 'react-admin';
import { makeStyles } from 'tss-react/mui';

export const UserContextTitle = ({
    actions,
    basePath,
    resource,
    record,
    ...rest
}) => {
    const translate = useTranslate();
    const { classes } = useStyles(rest);

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

const useStyles = makeStyles({ name: 'Layer7UserContextTitle' })(
    theme => ({
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
        },
    })
);
