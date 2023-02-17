import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslate } from 'ra-core';
import { ShowButton, TopToolbar } from 'react-admin';

import { Edit } from '../ui';
import { ApplicationEditView } from './ApplicationEditView';
import { ApplicationTitle } from './ApplicationTitle';
import { useUserContext } from '../userContexts';

const useStyles = makeStyles(
    {
        root: {},
        card: {},
    },
    {
        name: 'Layer7ApplicationCreate',
    }
);

const AppEditActions = ({ basePath, data, resource, className }) => {
    return (
        <TopToolbar className={className}>
            <div />
        </TopToolbar>
    );
};

export const ApplicationEdit = props => {
    const { root: rootClassName, ...classes } = useStyles(props);
    const { permissions, id, ...rest } = props;
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
            {...props}
        >
            <ApplicationEditView userContext={userContext} />
        </Edit>
    );
};
