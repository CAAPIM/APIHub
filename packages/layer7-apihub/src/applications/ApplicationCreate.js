import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslate } from 'ra-core';

import { Create } from '../ui';
import { ApplicationNew } from './ApplicationNew';
import { useUserContext } from '../userContexts';

const useTitleStyles = makeStyles(
    theme => ({
        root: {},
        title: {},
        status: {
            padding: theme.spacing(1, 0),
        },
    }),
    {
        name: 'Layer7ApplicationTitle',
    }
);

const useStyles = makeStyles(
    {
        root: {},
        card: {},
    },
    {
        name: 'Layer7ApplicationCreate',
    }
);

//TODO: proper translation for Title
const Title = ({ ...rest }) => {
    const classes = useTitleStyles(rest);
    const translate = useTranslate();

    return (
        <div className={classes.root}>
            <span className={classes.title}>
                {translate('resources.applications.actions.addApplication')}
            </span>
        </div>
    );
};
export const ApplicationCreate = props => {
    const { root: rootClassName, ...classes } = useStyles(props);
    const { permissions, id, ...rest } = props;
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
                {...rest}
            >
                <ApplicationNew userContext={userContext} />
            </Create>
        )
    );
};
