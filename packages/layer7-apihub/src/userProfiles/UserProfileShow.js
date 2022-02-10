import React from 'react';
import { Show, SimpleShowLayout, TextField, EditButton } from 'react-admin';
import { makeStyles } from '@material-ui/core';

import { ViewTitle } from '../ui';
import { UserProfileTitle } from './UserProfileTitle';

export const UserProfileShow = props => {
    const classes = useStyles(props);

    return (
        <>
            <ViewTitle />
            <Show
                {...props}
                title={<UserProfileTitle actions={<EditButton />} {...props} />}
                actions={null}
            >
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

const useStyles = makeStyles(
    theme => ({
        root: {
            padding: `${theme.spacing(4)}px !important`,
        },
        field: {
            width: 456,
        },
    }),
    {
        name: 'Layer7UserProfileShow',
    }
);
