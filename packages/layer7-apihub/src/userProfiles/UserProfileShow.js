// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { Show, SimpleShowLayout, TextField } from 'react-admin';
import { makeStyles } from 'tss-react/mui';

import { ViewTitle } from '../ui';
import { UserProfileTitle } from './UserProfileTitle';

export const UserProfileShow = props => {
    const { classes } = useStyles(props);

    return (
        <>
            <ViewTitle />
            <Show title={<UserProfileTitle />}>
                <SimpleShowLayout className={classes.root}>
                    <TextField className={classes.field} source="userName" />
                    <TextField className={classes.field} source="lastName" />
                    <TextField className={classes.field} source="firstName" />
                    <TextField className={classes.field} source="email" />
                </SimpleShowLayout>
            </Show>
        </>
    );
};

const useStyles = makeStyles({ name: 'Layer7UserProfileShow' })(theme => ({
    root: {
        padding: `${theme.spacing(4)} !important`,
    },
    field: {
        width: 456,
    },
}));
