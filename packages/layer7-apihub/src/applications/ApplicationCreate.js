// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { makeStyles } from 'tss-react/mui';
import { useTranslate } from 'react-admin';

import { Create } from '../ui';
import { ApplicationNew } from './ApplicationNew';
import { useUserContext } from '../userContexts';

const useTitleStyles = makeStyles({ name: 'Layer7ApplicationTitle' })(
    theme => ({
        root: {},
        title: {},
        status: {
            padding: theme.spacing(1, 0),
        },
    })
);

const useStyles = makeStyles({ name: 'Layer7ApplicationCreate' })({
    root: {},
    card: {},
});

//TODO: proper translation for Title
const Title = ({ ...rest }) => {
    const { classes } = useTitleStyles(rest);
    const translate = useTranslate();

    return (
        <div className={classes.root}>
            <span className={classes.title}>
                {translate('resources.applications.actions.addApplication')}
            </span>
        </div>
    );
};
export const ApplicationCreate = () => {
    const { classes } = useStyles();
    const { root: rootClassName } = classes;
    const [userContext] = useUserContext();
    const [canCreateApp, setCanCreateApp] = React.useState(false);

    React.useEffect(() => {
        if (userContext && !userContext.userDetails.developer) {
            setCanCreateApp(true);
        }
    }, [userContext]);

    return (
        canCreateApp && (
            <Create
                className={rootClassName}
                classes={classes}
                title={<Title />}
            >
                <ApplicationNew userContext={userContext} />
            </Create>
        )
    );
};
