import React from 'react';
import { Show, SimpleShowLayout, TextField, EditButton } from 'react-admin';
import { makeStyles } from '@material-ui/core';

import { ViewTitle } from '../ui';
import { UserContextTitle } from './UserContextTitle';
import { UserContextSubtitle } from './UserContextSubtitle';

const useStyles = makeStyles(theme => ({
    root: {
        padding: `${theme.spacing(4)}px !important`,
    },
    field: {
        width: 456,
    },
}));

export const UserContextShow = props => {
    const classes = useStyles(props);

    return (
        <>
            <ViewTitle />
            <Show
                {...props}
                title={<UserContextTitle actions={<EditButton />} {...props} />}
                actions={null}
            >
                <SimpleShowLayout className={classes.root}>
                    <TextField
                        className={classes.field}
                        source="userDetails.username"
                    />
                    <TextField
                        className={classes.field}
                        source="userDetails.lastName"
                    />
                    <TextField
                        className={classes.field}
                        source="userDetails.firstName"
                    />
                    <TextField
                        className={classes.field}
                        source="userDetails.email"
                    />
                    <UserContextSubtitle />
                    <TextField
                        className={classes.field}
                        source="userDetails.password"
                        type="password"
                    />
                </SimpleShowLayout>
            </Show>
        </>
    );
};
