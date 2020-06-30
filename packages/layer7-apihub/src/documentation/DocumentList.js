import React from 'react';
import { useGetOne, CRUD_GET_ONE } from 'react-admin';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import { ENTITY_TYPE_CUSTOM } from '../dataProvider/documents';
import { CurrentUserId } from '../dataProvider/userContexts';
import { isPortalAdmin } from '../userContexts';
import { Documentation } from './Documentation';
import { DocumentTitle } from './DocumentTitle';
import { ViewTitle } from '../ui';

export const DocumentList = ({ title = <DocumentTitle />, ...props }) => {
    const classes = useStyles(props);

    const { data: userContexts } = useGetOne('userContexts', CurrentUserId, {
        action: CRUD_GET_ONE,
    });

    const isAdmin = isPortalAdmin(userContexts);
    const userCanDelete = isAdmin;
    const userCanEdit = isAdmin;

    return (
        <>
            <ViewTitle>{title}</ViewTitle>
            <Paper className={classes.root}>
                <Documentation
                    entityType={ENTITY_TYPE_CUSTOM}
                    entityUuid="wiki1"
                    userCanDelete={userCanDelete}
                    userCanEdit={userCanEdit}
                />
            </Paper>
        </>
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {
            padding: theme.spacing(2),
            flexGrow: 1,
        },
    }),
    {
        name: 'Layer7DocumentList',
    }
);
