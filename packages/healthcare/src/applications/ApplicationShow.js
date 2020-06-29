import React from 'react';
import { Show } from 'layer7-apihub';
import { makeStyles } from '@material-ui/core/styles';

import { ApplicationTitle } from './ApplicationTitle';
import { ApplicationDetails } from './ApplicationDetails';

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

const useStyles = makeStyles(
    {
        root: {},
        card: {},
    },
    {
        name: 'HealthcareApplicationShow',
    }
);
