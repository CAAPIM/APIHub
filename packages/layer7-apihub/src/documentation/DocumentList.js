// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useGetOne } from 'react-admin';
import Paper from '@mui/material/Paper';
import { makeStyles } from 'tss-react/mui';

import { ENTITY_TYPE_CUSTOM } from '../dataProvider/documents';
import { CurrentUserId } from '../dataProvider/userContexts';
import { isPortalAdmin } from '../userContexts';
import { Documentation } from './Documentation';
import { DocumentTitle } from './DocumentTitle';
import { ViewTitle } from '../ui';

export const DocumentList = ({ title = <DocumentTitle />, ...props }) => {
    const { classes } = useStyles(props);

    const { data: userContexts } = useGetOne('userContexts', {
        id: CurrentUserId,
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

const useStyles = makeStyles({ name: 'Layer7DocumentList' })(theme => ({
    root: {
        padding: theme.spacing(2),
        flexGrow: 1,
    },
}));
