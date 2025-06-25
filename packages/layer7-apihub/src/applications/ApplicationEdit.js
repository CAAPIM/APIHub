// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { makeStyles } from 'tss-react/mui';
import { TopToolbar } from 'react-admin';
import { Edit } from '../ui';
import { ApplicationEditView } from './ApplicationEditView';
import { ApplicationTitle } from './ApplicationTitle';
import { useUserContext } from '../userContexts';

const useStyles = makeStyles({ name: 'Layer7ApplicationCreate' })({
    root: {},
    card: {},
});

const AppEditActions = ({ className }) => {
    return <TopToolbar className={className} />;
};

export const ApplicationEdit = () => {
    const { classes } = useStyles();
    const { root: rootClassName } = classes;
    const [userContext] = useUserContext();

    if (!userContext) {
        return null;
    }
    return (
        <Edit
            className={rootClassName}
            classes={classes}
            title={<ApplicationTitle />}
            actions={<AppEditActions className={classes.topToolbar} />}
        >
            <ApplicationEditView userContext={userContext} />
        </Edit>
    );
};
