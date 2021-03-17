import React from 'react';
import { Sidebar as RaSidebar } from 'react-admin';
import { makeStyles } from '@material-ui/core';

import { BrandLogo } from '../ui';

export const Sidebar = ({ children, ...rest }) => {
    const classes = useStyles(rest);

    return (
        <RaSidebar className={classes.root} {...rest}>
            <>
                {children}
                <div className={classes.brand}>
                    <BrandLogo className={classes.logo} />
                </div>
            </>
        </RaSidebar>
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {
            position: 'relative',
        },
        brand: {
            position: 'absolute',
            bottom: '0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100px',
            backgroundColor: theme.palette.secondary.dark,
        },
        logo: {
            fill: theme.palette.primary.main,
            padding: theme.spacing(0, 2),
        },
    }),
    {
        name: 'HealthcareSidebar',
    }
);
