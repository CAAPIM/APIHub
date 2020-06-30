import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Show } from '../ui';
import { ApplicationDetails } from './ApplicationDetails';
import { ApplicationTitle } from './ApplicationTitle';

export const ApplicationShow = props => {
    const { root: rootClassName, ...classes } = useStyles(props);
    const { permissions, id, ...rest } = props;

    return (
        <Show
            className={rootClassName}
            classes={classes}
            title={<ApplicationTitle />}
            id={id}
            {...rest}
        >
            <ApplicationDetails />
        </Show>
    );
};

// We don't need custom styles by default but this allows to
// easily customize styles in the theme file directly
const useStyles = makeStyles(
    {
        root: {},
        card: {},
    },
    {
        name: 'Layer7ApplicationShow',
    }
);
