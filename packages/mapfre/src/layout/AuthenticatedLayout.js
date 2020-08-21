import React from 'react';
import { ApiHubLayout } from 'layer7-apihub';
import { theme } from '../theme';
import { makeStyles } from '@material-ui/core';

import { AuthenticatedAppBar } from './AuthenticatedAppBar';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';

export const AuthenticatedLayout = ({ children, ...rest }) => {
    const classes = useLayoutStyles();
    const footerClasses = useFooterStyles();

    return (
        <ApiHubLayout
            appBar={AuthenticatedAppBar}
            {...rest}
            theme={theme}
            sidebar={Sidebar}
        >
            <div className={classes.innerContent}>{children}</div>
            <Footer classes={footerClasses} withLogo={false} />
        </ApiHubLayout>
    );
};

const useLayoutStyles = makeStyles(
    theme => ({
        innerContent: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        },
    }),
    {
        name: 'HealthcareAuthenticatedLayout',
    }
);

const useFooterStyles = makeStyles(
    theme => ({
        root: {
            color: theme.palette.primary.main,
            backgroundColor: '#d1cfdd',
            height: '100px',
            padding: theme.spacing(0),
            paddingTop: theme.spacing(0),
            paddingRight: theme.spacing(6),
            paddingBottom: theme.spacing(0),
            paddingLeft: theme.spacing(2),
        },
        logo: {
            fill: theme.palette.primary.dark,
        },
        company: {
            color: theme.palette.primary.dark,
            padding: theme.spacing(0, 3),
            fontWeight: theme.typography.fontWeightRegular,
            fontSize: '0.9rem',
        },
        link: {
            color: theme.palette.primary.dark,
            fontWeight: theme.typography.fontWeightRegular,
            fontSize: '0.9rem',
        },
    }),
    {
        name: 'HealthcareAuthenticatedFooter',
    }
);
